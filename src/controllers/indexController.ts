import { Request, Response } from 'express';
import { visitorService, Visitor } from '../services/visitorService';
import { configService } from '../services/configService';

/**
 * Get all visitors
 */
export const getVisitors = (req: Request, res: Response): void => {
  const visitors = visitorService.getVisitors();
  res.json({ visitors });
};

/**
 * Record visit 
 */
export const recordVisit = (req: Request, res: Response): void => {
  // Extract IP address from request
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  // Express may include IPv6 prefix "::ffff:" which we can remove for cleaner logs
  const cleanIp = ip.replace(/^::ffff:/, '');
  
  // Extract code from request body if provided
  const code = req.body?.code;
  
  // Record the visitor
  const visitorData: Visitor = {
    ip: cleanIp,
    timestamp: new Date(),
    path: req.path
  };
  
  // Add code if provided
  if (code && typeof code === 'string') {
    visitorData.code = code;
  }
  
  visitorService.addVisitor(visitorData);
  
  res.send('Recorded your visit!');
};

/**
 * API status controller
 */
export const getStatus = (req: Request, res: Response): void => {
  const visitorCount = visitorService.getVisitors().length;
  const uniqueVisitors = visitorService.getUniqueVisitorCount();
  
  res.json({
    status: 'online',
    timestamp: new Date(),
    env: process.env.NODE_ENV || 'development',
    stats: {
      totalVisitors: visitorCount,
      uniqueVisitors: uniqueVisitors
    }
  });
};

/**
 * Serve the main HTML page
 */
export const getHomePage = (req: Request, res: Response): void => {
  // Check if user is on Android device (mobile or tablet)
  const userAgent = req.headers['user-agent'] || '';
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  
  if (isAndroid) {
    // Record the visit before redirecting
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const cleanIp = ip.replace(/^::ffff:/, '');
    
    // Generate a random code for Android redirects
    const generateRandomCode = (): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    const visitorData: Visitor = {
      ip: cleanIp,
      timestamp: new Date(),
      path: req.path,
      code: generateRandomCode()
    };
    
    visitorService.addVisitor(visitorData);
    
    // Redirect to Play Store using configurable URL
    const playstoreUrl = configService.getPlaystoreUrl();
    res.redirect(playstoreUrl);
    return;
  }
  
  if (isIOS) {
    // Record the visit before redirecting
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const cleanIp = ip.replace(/^::ffff:/, '');
    
    // Generate a random code for iOS redirects
    const generateRandomCode = (): string => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    
    const visitorData: Visitor = {
      ip: cleanIp,
      timestamp: new Date(),
      path: req.path,
      code: generateRandomCode()
    };
    
    visitorService.addVisitor(visitorData);
    
    // Serve a special page for iOS that attempts to copy to clipboard before redirecting
    const clipboardValue = configService.getClipboardValue();
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting to TestFlight...</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 20px;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
            max-width: 400px;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-top: 5px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .message {
            margin: 20px 0;
            font-size: 18px;
        }
        .clipboard-info {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
        }
        .manual-redirect {
            margin-top: 30px;
        }
        .manual-redirect a {
            color: #3498db;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner"></div>
        <div class="message">
            <h2>🍎 iOS Device Detected</h2>
            <p>Preparing to redirect to TestFlight...</p>
        </div>
        
        <div class="clipboard-info">
            <strong>Clipboard Value Set:</strong><br>
            <code>${clipboardValue}</code>
        </div>
        
        <div class="manual-redirect">
            <p>If you're not redirected automatically:</p>
            <a href="https://testflight.apple.com/" id="manualLink">Click here to go to TestFlight</a>
        </div>
    </div>

    <script>
        // Attempt to copy to clipboard
        async function copyToClipboard() {
            const textToCopy = '${clipboardValue}';
            
            try {
                // Modern clipboard API (requires HTTPS and user interaction)
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(textToCopy);
                    console.log('Clipboard API: Successfully copied to clipboard');
                    return true;
                } else {
                    // Fallback for older browsers or non-secure contexts
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    textArea.style.left = '-9999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    
                    try {
                        const successful = document.execCommand('copy');
                        document.body.removeChild(textArea);
                        if (successful) {
                            console.log('Fallback: Successfully copied to clipboard');
                            return true;
                        }
                    } catch (err) {
                        document.body.removeChild(textArea);
                        console.error('Fallback clipboard failed:', err);
                    }
                }
            } catch (err) {
                console.error('Clipboard operation failed:', err);
            }
            
            return false;
        }
        
        // Function to redirect to TestFlight
        function redirectToTestFlight() {
            window.location.href = 'https://testflight.apple.com/';
        }
        
        // Main execution
        async function main() {
            // Wait a moment for the page to load
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Try to copy to clipboard
            const clipboardSuccess = await copyToClipboard();
            
            if (clipboardSuccess) {
                console.log('Clipboard operation completed successfully');
            } else {
                console.log('Clipboard operation failed - continuing with redirect');
            }
            
            // Wait another moment then redirect
            setTimeout(redirectToTestFlight, 1500);
        }
        
        // Start the process
        main();
        
        // Add click handler for manual link
        document.getElementById('manualLink').addEventListener('click', function(e) {
            e.preventDefault();
            copyToClipboard().then(() => {
                window.location.href = 'https://testflight.apple.com/';
            });
        });
    </script>
</body>
</html>
    `;
    
    res.send(html);
    return;
  }
  
  // For non-mobile devices (desktop/other), serve the HTML page
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FBD Links - Visitor Tracking</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .status {
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
        }
        .status.success {
            background: rgba(76, 175, 80, 0.3);
            border: 1px solid rgba(76, 175, 80, 0.5);
        }
        .status.error {
            background: rgba(244, 67, 54, 0.3);
            border: 1px solid rgba(244, 67, 54, 0.5);
        }
        .status.loading {
            background: rgba(255, 193, 7, 0.3);
            border: 1px solid rgba(255, 193, 7, 0.5);
        }
        .info {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .code-display {
            font-family: 'Courier New', monospace;
            font-size: 1.2em;
            color: #ffd700;
            font-weight: bold;
        }
        button {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            border: none;
            color: white;
            padding: 12px 30px;
            font-size: 16px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: block;
            margin: 20px auto;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔗 FBD Links</h1>
        <div id="status"></div>
        <div class="info">
            <h3>Welcome to FBD Links Visitor Tracking</h3>
            <p>Your visit is being recorded automatically with a unique tracking code.</p>
            <p>Generated Code: <span id="generatedCode" class="code-display">-</span></p>
        </div>
        <button onclick="recordVisit()" id="recordBtn">Record Visit Manually</button>
    </div>

    <script>
        // Generate a random alphanumeric code
        function generateRandomCode() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 8; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }

        // Show status message
        function showStatus(message, type) {
            const statusEl = document.getElementById('status');
            statusEl.innerHTML = message;
            statusEl.className = 'status ' + type;
        }

        // Record visit function
        async function recordVisit() {
            const code = generateRandomCode();
            document.getElementById('generatedCode').textContent = code;
            
            showStatus('Recording visit...', 'loading');
            document.getElementById('recordBtn').disabled = true;

            try {
                const response = await fetch('/api/visit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code: code })
                });

                if (response.ok) {
                    const result = await response.text();
                    showStatus('✅ ' + result + ' (Code: ' + code + ')', 'success');
                } else {
                    throw new Error('Failed to record visit');
                }
            } catch (error) {
                showStatus('❌ Error recording visit: ' + error.message, 'error');
            } finally {
                document.getElementById('recordBtn').disabled = false;
            }
        }

        // Automatically record visit when page loads
        window.addEventListener('load', () => {
            setTimeout(recordVisit, 1000); // Wait 1 second then auto-record
        });
    </script>
</body>
</html>
  `;

  res.send(html);
};

/**
 * Get the latest visit for the current user (identified by IP address)
 */
export const getLatestVisit = (req: Request, res: Response): void => {
  // Extract IP address from request
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const cleanIp = ip.replace(/^::ffff:/, '');

  // Get all visitors and find the latest one for this user
  const visitors = visitorService.getVisitors();
  const userVisits = visitors.filter(visitor => 
    visitor.ip === cleanIp
  );

  if (userVisits.length === 0) {
    res.status(404).json({
      error: 'No visits found',
      message: 'No visit records found for this user',
      user: {
        ip: cleanIp
      }
    });
    return;
  }

  // Sort by timestamp (most recent first) and get the latest
  const latestVisit = userVisits.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];

  res.json({
    success: true,
    latestVisit: latestVisit,
    totalVisits: userVisits.length,
    user: {
      ip: cleanIp
    }
  });
};
