/**
 * Interface representing application configuration
 */
export interface AppConfig {
  playstoreUrl: string;
  clipboardValue: string;
}

/**
 * Service for managing application configuration
 */
class ConfigService {
  private config: AppConfig = {
    playstoreUrl: 'https://play.google.com/store/apps/details?id=com.brplinks&referrer=utm_source%3Dtest%26utm_medium%3Dchat%26utm_campaign%3D999901',
    clipboardValue: 'brplink::999901'
  };

  /**
   * Get the current Play Store URL
   * @returns The current Play Store URL
   */
  public getPlaystoreUrl(): string {
    return this.config.playstoreUrl;
  }

  /**
   * Update the Play Store URL
   * @param url The new Play Store URL
   */
  public updatePlaystoreUrl(url: string): void {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }
    
    // Basic URL validation
    try {
      new URL(url);
    } catch (error) {
      throw new Error('Invalid URL format');
    }
    
    this.config.playstoreUrl = url;
    console.log(`Play Store URL updated to: ${url}`);
  }

  /**
   * Get the current clipboard value
   * @returns The current clipboard value
   */
  public getClipboardValue(): string {
    return this.config.clipboardValue;
  }

  /**
   * Update the clipboard value
   * @param value The new clipboard value
   */
  public updateClipboardValue(value: string): void {
    if (typeof value !== 'string') {
      throw new Error('Invalid clipboard value provided');
    }
    
    this.config.clipboardValue = value;
    console.log(`Clipboard value updated to: ${value}`);
  }

  /**
   * Get all configuration
   * @returns Current application configuration
   */
  public getConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * Reset Play Store URL to default
   */
  public resetPlaystoreUrl(): void {
    this.config.playstoreUrl = 'https://play.google.com/store/apps/details?id=com.brplinks&referrer=utm_source%3Dtest%26utm_medium%3Dchat%26utm_campaign%3Ddemo';
    console.log('Play Store URL reset to default');
  }

  /**
   * Reset clipboard value to default
   */
  public resetClipboardValue(): void {
    this.config.clipboardValue = 'brplink::demo';
    console.log('Clipboard value reset to default');
  }

  /**
   * Reset all configuration to defaults
   */
  public resetAllConfig(): void {
    this.config = {
      playstoreUrl: 'https://play.google.com/store/apps/details?id=com.brplinks&referrer=utm_source%3Dtest%26utm_medium%3Dchat%26utm_campaign%3Ddemo',
      clipboardValue: 'brplink::demo'
    };
    console.log('All configuration reset to defaults');
  }
}

// Export a singleton instance
export const configService = new ConfigService();

// Export the service class itself in case it needs to be extended
export default ConfigService;
