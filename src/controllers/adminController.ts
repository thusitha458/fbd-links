import { Request, Response } from 'express';
import { configService } from '../services/configService';

/**
 * Serve the admin interface
 */
export const getAdminPage = (req: Request, res: Response): void => {
  const currentConfig = configService.getConfig();
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FBD Links - Admin Panel</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
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
            color: #ecf0f1;
        }
        h2 {
            color: #3498db;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
            margin-top: 30px;
        }
        .form-group {
            margin: 20px 0;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            color: #ecf0f1;
        }
        input[type="url"] {
            width: 100%;
            padding: 12px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 16px;
            box-sizing: border-box;
        }
        input[type="url"]:focus {
            outline: none;
            border-color: #3498db;
            background: rgba(255, 255, 255, 0.15);
        }
        input[type="url"]::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
        .button-group {
            display: flex;
            gap: 15px;
            margin-top: 20px;
            flex-wrap: wrap;
        }
        button {
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
        }
        .btn-primary {
            background: linear-gradient(45deg, #3498db, #2980b9);
            color: white;
        }
        .btn-secondary {
            background: linear-gradient(45deg, #95a5a6, #7f8c8d);
            color: white;
        }
        .btn-danger {
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            color: white;
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
        .status {
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            font-weight: bold;
            display: none;
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
        .current-config {
            background: rgba(255, 255, 255, 0.05);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            word-break: break-all;
        }
        .navigation {
            text-align: center;
            margin-bottom: 20px;
        }
        .navigation a {
            color: #3498db;
            text-decoration: none;
            margin: 0 15px;
            padding: 8px 16px;
            border: 1px solid #3498db;
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        .navigation a:hover {
            background: #3498db;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="navigation">
            <a href="/">← Back to Home</a>
            <a href="/api/visitors">View Visitors</a>
            <a href="/api/status">API Status</a>
        </div>
        
        <h1>🔧 Admin Panel</h1>
        
        <div id="status"></div>
        
        <h2>📱 Play Store Configuration</h2>
        
        <div class="current-config">
            <strong>Current Play Store URL:</strong><br>
            <code id="currentUrl">${currentConfig.playstoreUrl}</code>
        </div>
        
        <form id="configForm">
            <div class="form-group">
                <label for="playstoreUrl">Play Store URL:</label>
                <input 
                    type="url" 
                    id="playstoreUrl" 
                    name="playstoreUrl" 
                    value="${currentConfig.playstoreUrl}"
                    placeholder="https://play.google.com/store/apps/details?id=com.example.app"
                    required
                >
            </div>
            
            <div class="button-group">
                <button type="submit" class="btn-primary">💾 Update URL</button>
                <button type="button" onclick="resetToDefault()" class="btn-danger">🔄 Reset to Default</button>
                <button type="button" onclick="testUrl()" class="btn-secondary">🔗 Test URL</button>
            </div>
        </form>

        <h2>📋 Clipboard Configuration</h2>
        
        <div class="current-config">
            <strong>Current Clipboard Value:</strong><br>
            <code id="currentClipboardValue">${currentConfig.clipboardValue}</code>
        </div>
        
        <form id="clipboardForm">
            <div class="form-group">
                <label for="clipboardValue">Clipboard Value:</label>
                <input 
                    type="text" 
                    id="clipboardValue" 
                    name="clipboardValue" 
                    value="${currentConfig.clipboardValue}"
                    placeholder="Enter clipboard value"
                    required
                >
            </div>
            
            <div class="button-group">
                <button type="submit" class="btn-primary">💾 Update Clipboard</button>
                <button type="button" onclick="resetClipboardToDefault()" class="btn-danger">🔄 Reset Clipboard</button>
            </div>
        </form>
    </div>

    <script>
        // Show status message
        function showStatus(message, type) {
            const statusEl = document.getElementById('status');
            statusEl.innerHTML = message;
            statusEl.className = 'status ' + type;
            statusEl.style.display = 'block';
            
            // Hide after 5 seconds
            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 5000);
        }

        // Handle form submission
        document.getElementById('configForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const playstoreUrl = formData.get('playstoreUrl');
            
            try {
                const response = await fetch('/admin/config/playstore', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ playstoreUrl: playstoreUrl })
                });

                const result = await response.json();
                
                if (response.ok) {
                    showStatus('✅ Play Store URL updated successfully!', 'success');
                    document.getElementById('currentUrl').textContent = playstoreUrl;
                } else {
                    showStatus('❌ Error: ' + result.message, 'error');
                }
            } catch (error) {
                showStatus('❌ Network error: ' + error.message, 'error');
            }
        });

        // Reset to default
        async function resetToDefault() {
            if (!confirm('Are you sure you want to reset the Play Store URL to default?')) {
                return;
            }
            
            try {
                const response = await fetch('/admin/config/playstore/reset', {
                    method: 'POST'
                });

                const result = await response.json();
                
                if (response.ok) {
                    showStatus('✅ Play Store URL reset to default!', 'success');
                    document.getElementById('playstoreUrl').value = result.playstoreUrl;
                    document.getElementById('currentUrl').textContent = result.playstoreUrl;
                } else {
                    showStatus('❌ Error: ' + result.message, 'error');
                }
            } catch (error) {
                showStatus('❌ Network error: ' + error.message, 'error');
            }
        }

        // Test URL
        function testUrl() {
            const url = document.getElementById('playstoreUrl').value;
            if (url) {
                window.open(url, '_blank');
            } else {
                showStatus('⚠️ Please enter a URL to test', 'error');
            }
        }

        // Handle clipboard form submission
        document.getElementById('clipboardForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const clipboardValue = formData.get('clipboardValue');
            
            try {
                const response = await fetch('/admin/config/clipboard', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ clipboardValue: clipboardValue })
                });

                const result = await response.json();
                
                if (response.ok) {
                    showStatus('✅ Clipboard value updated successfully!', 'success');
                    document.getElementById('currentClipboardValue').textContent = clipboardValue;
                } else {
                    showStatus('❌ Error: ' + result.message, 'error');
                }
            } catch (error) {
                showStatus('❌ Network error: ' + error.message, 'error');
            }
        });

        // Reset clipboard to default
        async function resetClipboardToDefault() {
            if (!confirm('Are you sure you want to reset the clipboard value to default?')) {
                return;
            }
            
            try {
                const response = await fetch('/admin/config/clipboard/reset', {
                    method: 'POST'
                });

                const result = await response.json();
                
                if (response.ok) {
                    showStatus('✅ Clipboard value reset to default!', 'success');
                    document.getElementById('clipboardValue').value = result.clipboardValue;
                    document.getElementById('currentClipboardValue').textContent = result.clipboardValue;
                } else {
                    showStatus('❌ Error: ' + result.message, 'error');
                }
            } catch (error) {
                showStatus('❌ Network error: ' + error.message, 'error');
            }
        }
    </script>
</body>
</html>
  `;

  res.send(html);
};

/**
 * Update Play Store URL
 */
export const updatePlaystoreUrl = (req: Request, res: Response): void => {
  try {
    const { playstoreUrl } = req.body;
    
    if (!playstoreUrl) {
      res.status(400).json({
        success: false,
        message: 'Play Store URL is required'
      });
      return;
    }
    
    configService.updatePlaystoreUrl(playstoreUrl);
    
    res.json({
      success: true,
      message: 'Play Store URL updated successfully',
      playstoreUrl: playstoreUrl
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

/**
 * Reset Play Store URL to default
 */
export const resetPlaystoreUrl = (req: Request, res: Response): void => {
  try {
    configService.resetPlaystoreUrl();
    const config = configService.getConfig();
    
    res.json({
      success: true,
      message: 'Play Store URL reset to default',
      playstoreUrl: config.playstoreUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

/**
 * Update clipboard value
 */
export const updateClipboardValue = (req: Request, res: Response): void => {
  try {
    const { clipboardValue } = req.body;
    
    if (clipboardValue === undefined || clipboardValue === null) {
      res.status(400).json({
        success: false,
        message: 'Clipboard value is required'
      });
      return;
    }
    
    configService.updateClipboardValue(clipboardValue);
    
    res.json({
      success: true,
      message: 'Clipboard value updated successfully',
      clipboardValue: clipboardValue
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

/**
 * Reset clipboard value to default
 */
export const resetClipboardValue = (req: Request, res: Response): void => {
  try {
    configService.resetClipboardValue();
    const config = configService.getConfig();
    
    res.json({
      success: true,
      message: 'Clipboard value reset to default',
      clipboardValue: config.clipboardValue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

/**
 * Get current configuration
 */
export const getConfig = (req: Request, res: Response): void => {
  const config = configService.getConfig();
  res.json({
    success: true,
    config: config
  });
};
