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
 * Update provider code
 */
export const updateProviderCode = (req: Request, res: Response): void => {
  try {
    const { providerCode } = req.body;
    
    if (!providerCode) {
      res.status(400).json({
        success: false,
        message: 'Provider code is required'
      });
      return;
    }
    
    configService.updateProviderCode(providerCode);
    
    res.json({
      success: true,
      message: 'Provider code updated successfully',
      providerCode: providerCode
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

/**
 * Reset provider code to default
 */
export const resetProviderCode = (req: Request, res: Response): void => {
  try {
    configService.resetProviderCode();
    const config = configService.getConfig();
    
    res.json({
      success: true,
      message: 'Provider code reset to default',
      providerCode: config.providerCode
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
