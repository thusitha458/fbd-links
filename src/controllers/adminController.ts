import { Request, Response } from 'express';
import { configService } from '../services/configService';

/**
 * Serve the admin interface
 */
export const getAdminPage = (req: Request, res: Response): void => {
  const currentConfig = configService.getConfig();
  
  res.render('admin', {
    config: currentConfig
  });
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
