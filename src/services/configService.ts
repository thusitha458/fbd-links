/**
 * Interface representing application configuration
 */
export interface AppConfig {
  providerCode: string;
}

/**
 * Service for managing application configuration
 */
class ConfigService {
  private config: AppConfig = {
    providerCode: '999901'
  };

  /**
   * Get the current Play Store URL
   * @returns The current Play Store URL
   */
  public getPlaystoreUrl(): string {
    return `https://play.google.com/store/apps/details?id=com.brplinks&referrer=utm_source%3Dtest%26utm_medium%3Dchat%26utm_campaign%3D${this.config.providerCode}`;
  }

  /**
   * Get the current clipboard value
   * @returns The current clipboard value
   */
  public getClipboardValue(): string {
    return `1${this.config.providerCode}`;
  }

  /**
   * Get all configuration
   * @returns Current application configuration
   */
  public getConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * Get the current provider code
   * @returns The current provider code
   */
  public getProviderCode(): string {
    return this.config.providerCode;
  }

  /**
   * Update the provider code
   * @param code The new provider code
   */
  public updateProviderCode(code: string): void {
    if (typeof code !== 'string' || code.trim().length === 0) {
      throw new Error('Invalid provider code provided');
    }
    
    this.config.providerCode = code.trim();
    console.log(`Provider code updated to: ${code}`);
  }

  /**
   * Reset provider code to default
   */
  public resetProviderCode(): void {
    this.config.providerCode = '999901';
    console.log('Provider code reset to default');
  }

  /**
   * Reset all configuration to defaults
   */
  public resetAllConfig(): void {
    this.config = {
      providerCode: '999901'
    };
    console.log('All configuration reset to defaults');
  }
}

// Export a singleton instance
export const configService = new ConfigService();

// Export the service class itself in case it needs to be extended
export default ConfigService;
