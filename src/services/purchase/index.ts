import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesOffering, CustomerInfo } from 'react-native-purchases';

const ENABLE_REVENUECAT = true; // Set to true to test actual RevenueCat
const REVENUECAT_API_KEY = 'test_sgCutEwbwTsPAtsBrvSKUCIYBiM';
const ENTITLEMENT_ID = 'I am Aura Life';

export class PurchaseService {
  private static isMock = false;

  /**
   * Initializes RevenueCat SDK with the provided API key
   */
  static async initialize() {
    if (!ENABLE_REVENUECAT) {
      console.log('RevenueCat Disabled: Entering Mock Mode for local device testing');
      this.isMock = true;
      return;
    }

    try {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

      if (Platform.OS === 'ios') {
        // Only attempt to configure if we're NOT in a release build or if we want to try anyway
        // If it fails (no developer account), we'll fall back to mock mode
        Purchases.configure({ apiKey: REVENUECAT_API_KEY });
        console.log('RevenueCat initialized successfully');
      }
    } catch (e) {
      console.warn(
        'RevenueCat Initialization Failed: Entering Mock Mode for local device testing',
        e
      );
      this.isMock = true;
    }
  }

  /**
   * Checks if the user has the 'I am Aura Life' entitlement
   */
  static async checkEntitlement(): Promise<boolean> {
    if (this.isMock) {
      // In mock mode, we assume the user HAS it for testing purposes if you want
      // OR return false to test the paywall. Change to true if you want to skip paywall.
      return false;
    }
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    } catch (e) {
      console.error('RevenueCat Error: Failed to fetch customer info', e);
      return false;
    }
  }

  /**
   * Fetches the current offerings (products)
   */
  static async fetchOfferings(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        return offerings.current;
      }
    } catch (e) {
      console.error('RevenueCat Error: Failed to fetch offerings', e);
    }
    return null;
  }

  /**
   * Performs a purchase
   */
  static async purchase(packageObject: any): Promise<boolean> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageObject);
      return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    } catch (e: any) {
      if (!e.userCancelled) {
        console.error('RevenueCat Error: Purchase failed', e);
      }
      return false;
    }
  }

  /**
   * Restores previous purchases
   */
  static async restorePurchases(): Promise<boolean> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    } catch (e) {
      console.error('RevenueCat Error: Failed to restore purchases', e);
      return false;
    }
  }

  /**
   * Logs in a user (useful for syncing accounts)
   */
  static async login(appUserId: string): Promise<CustomerInfo> {
    const { customerInfo } = await Purchases.logIn(appUserId);
    return customerInfo;
  }

  /**
   * Logs out the current user
   */
  static async logout(): Promise<CustomerInfo> {
    return await Purchases.logOut();
  }

  /**
   * Shows the Customer Center for subscription management
   * (React Native Purchases 9.15.1+)
   */
  static async showCustomerCenter() {
    try {
      // @ts-ignore - Some older type definitions might not include this yet
      if (Purchases.showCustomerCenter) {
        // @ts-ignore
        await Purchases.showCustomerCenter();
      } else {
        console.warn('Customer Center not available in this SDK version.');
      }
    } catch (e) {
      console.error('RevenueCat Error: Failed to show Customer Center', e);
    }
  }
}
