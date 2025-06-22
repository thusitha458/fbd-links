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
    
    // Serve a special page for iOS with button-triggered clipboard and redirect
    const clipboardValue = configService.getClipboardValue();
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install Our App - iOS</title>
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
        .app-icon {
            font-size: 80px;
            margin-bottom: 20px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #ecf0f1;
        }
        .description {
            font-size: 16px;
            margin-bottom: 30px;
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.5;
        }
        .install-button {
            background: linear-gradient(45deg, #3498db, #2980b9);
            border: none;
            color: white;
            padding: 18px 30px;
            font-size: 18px;
            font-weight: bold;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            margin-bottom: 20px;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        }
        .install-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
        }
        .install-button:active {
            transform: translateY(0);
        }
        .install-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .clipboard-info {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .status {
            padding: 12px;
            border-radius: 8px;
            margin: 15px 0;
            font-weight: bold;
            display: none;
            font-size: 14px;
        }
        .status.success {
            background: rgba(46, 204, 113, 0.3);
            border: 1px solid rgba(46, 204, 113, 0.5);
            color: #2ecc71;
        }
        .status.error {
            background: rgba(231, 76, 60, 0.3);
            border: 1px solid rgba(231, 76, 60, 0.5);
            color: #e74c3c;
        }
        .ios-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 12px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="ios-badge">📱 iOS Device Detected</div>
        <div class="app-icon">🚀</div>
        <div class="title">Get Our App!</div>
        <div class="description">
            Ready to experience our app? Click the button below to install via TestFlight.
        </div>
        
        <div id="status"></div>
        
        <button id="installButton" class="install-button" onclick="installApp()">
            📦 Install the App
        </button>
        
        <div class="clipboard-info">
            <strong>📋 What happens when you click:</strong><br>
            • Copies tracking code to clipboard<br>
            • Opens TestFlight for app installation<br>
            • Code: <code>${clipboardValue}</code>
        </div>
    </div>

    <script>
        // Show status message
        function showStatus(message, type) {
            const statusEl = document.getElementById('status');
            statusEl.innerHTML = message;
            statusEl.className = 'status ' + type;
            statusEl.style.display = 'block';
            
            // Hide after 3 seconds
            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 3000);
        }

        // Copy to clipboard function
        async function copyToClipboard(text) {
            try {
                // Modern clipboard API (works with user interaction)
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                    console.log('Clipboard API: Successfully copied to clipboard');
                    return true;
                } else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
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
        
        // Main install function triggered by button click
        async function installApp() {
            const button = document.getElementById('installButton');
            const clipboardText = '${clipboardValue}';
            
            // Disable button during process
            button.disabled = true;
            button.textContent = '📋 Copying...';
            
            try {
                // Attempt to copy to clipboard
                const clipboardSuccess = await copyToClipboard(clipboardText);
                
                if (clipboardSuccess) {
                    showStatus('✅ Tracking code copied to clipboard!', 'success');
                    button.textContent = '🚀 Opening TestFlight...';
                    
                    // Wait a moment then redirect
                    setTimeout(() => {
                        window.location.href = 'https://testflight.apple.com/';
                    }, 1000);
                } else {
                    showStatus('⚠️ Clipboard copy failed, but proceeding to TestFlight', 'error');
                    button.textContent = '🚀 Opening TestFlight...';
                    
                    // Still redirect even if clipboard failed
                    setTimeout(() => {
                        window.location.href = 'https://testflight.apple.com/';
                    }, 1500);
                }
            } catch (error) {
                console.error('Install process error:', error);
                showStatus('❌ Something went wrong, but opening TestFlight...', 'error');
                
                // Redirect anyway
                setTimeout(() => {
                    window.location.href = 'https://testflight.apple.com/';
                }, 1500);
            } finally {
                // Re-enable button after 3 seconds in case user stays on page
                setTimeout(() => {
                    button.disabled = false;
                    button.textContent = '📦 Install the App';
                }, 3000);
            }
        }
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
