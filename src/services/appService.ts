import fetch from "node-fetch";

const APP_SERVICE_URL = "https://appservice.brpsystems.net/apps";

class AppService {
  public async getAppInfoFromProviderCode(providerCode: string) {
    try {
      const appIdAndApiUrl = await this.getAppIdAndApiUrlFromProviderCode(
        providerCode
      );

      const appId = appIdAndApiUrl?.appId;
      const api3Url = appIdAndApiUrl?.api3Url;
      if (!appId || !api3Url) {
        return null;
      }

      return await this.getAppInfo(appId, api3Url);
    } catch (e) {
      return null;
    }
  }

  private async getAppIdAndApiUrlFromProviderCode(providerCode: string) {
    try {
      const response = await fetch(
        `${APP_SERVICE_URL}?appCode=${providerCode}`
      );

      if (response.status === 200) {
        const apps = (await response.json()) as {
          appId: number;
          api3Url: string;
        }[];
        return apps.length > 0 ? apps?.[0] : null;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  private async getAppInfo(appId: number, api3Url: string) {
    try {
      const response = await fetch(`${api3Url}/api/ver3/apps/${appId}`);

      if (response.status === 200) {
        const appInfo = (await response.json()) as {
          appName: string;
          assets: {
            type: string;
            theme: string;
            contentUrl: string;
            imageHeight: number;
            imageWidth: number;
          }[];
          themes: {
            light: {
              primaryColor: string;
            };
            dark: {
              primaryColor: string;
            };
          };
        };

        const appName = appInfo?.appName || '';
        const lightLogo = (appInfo?.assets || []).find(it => it.type === 'LOGO' && it.theme === 'light');
        const darkLogo = (appInfo?.assets || []).find(it => it.type === 'LOGO' && it.theme === 'dark');
        const primaryColor = appInfo?.themes?.light?.primaryColor || appInfo?.themes?.dark?.primaryColor;

        return {
          appName: appName || '',
          logo: lightLogo ? {
            contentUrl: lightLogo.contentUrl,
            imageHeight: lightLogo.imageHeight,
            imageWidth: lightLogo.imageWidth,
          } : darkLogo ? {
            contentUrl: darkLogo.contentUrl,
            imageHeight: darkLogo.imageHeight,
            imageWidth: darkLogo.imageWidth,
          } : null,
          primaryColor: primaryColor || '#0000FF',
        }
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }
}

export const appService = new AppService();

export default AppService;
