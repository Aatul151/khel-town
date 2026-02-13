/**
 * Common Ad Service for Reward Ads
 * Can be reused across all games
 */

export interface AdRewardCallback {
  onRewardEarned?: () => void;
  onAdClosed?: () => void;
  onAdError?: (error: string) => void;
}

export interface AdService {
  /**
   * Check if ads are available/loaded
   */
  isAdAvailable(): boolean;

  /**
   * Show a reward ad
   * @param rewardType - Type of reward (e.g., 'hint', 'continue', 'coins')
   * @param callbacks - Callbacks for ad events
   */
  showRewardAd(rewardType: string, callbacks: AdRewardCallback): Promise<void>;

  /**
   * Preload ads (call this on game start)
   */
  preloadAds(): Promise<void>;
}

/**
 * Google AdSense Ad Service Implementation
 * For web-based games
 */
class GoogleAdSenseService implements AdService {
  private adsInitialized = false;
  private adsReady = false;
  private adUnitId: string;

  constructor(adUnitId?: string) {
    // Default test ad unit ID - replace with your actual AdSense ad unit ID
    // Format: ca-pub-XXXXXXXXXX/YYYYYYYYYY
    // Get it from: AdSense Dashboard → Ads → By site → Select kheltown.in → Create ad unit
    // 
    // IMPORTANT: AdSense works with your domain automatically!
    // - Add kheltown.in in AdSense Sites and create ad units for it
    // - Use your Publisher ID (ca-pub-XXXXXXXXXX) from AdSense Account Information
    this.adUnitId = adUnitId || 'ca-pub-XXXXXXXXXX'; // Test ID
    console.log('AdSense ad unit ID:', this.adUnitId);
    console.log('Note: Replace with your actual ad unit ID from AdSense dashboard');
  }

  isAdAvailable(): boolean {
    return this.adsReady && typeof window !== 'undefined' && 'adsbygoogle' in (window as any);
  }

  async preloadAds(): Promise<void> {
    if (this.adsInitialized) return;

    try {
      //already added in index.html
      this.adsInitialized = true;
      this.adsReady = true;
    } catch (error) {
      console.warn('AdSense initialization failed:', error);
      this.adsReady = false;
    }
  }

  async showRewardAd(rewardType: string, callbacks: AdRewardCallback): Promise<void> {
    // Check if we're in development mode (no real ad unit ID configured)
    const isDevelopmentMode = this.adUnitId.includes('3940256099942544') || this.adUnitId.includes('XXXXXXXXXX');
    
    if (!this.isAdAvailable() || isDevelopmentMode) {
      // Fallback: Simulate ad for development/testing
      console.log(`[DEV MODE] Showing reward ad for: ${rewardType}`);
      return this.simulateAd(callbacks);
    }

    try {
      // Try to show real AdSense interstitial ad
      return this.showInterstitialAd(callbacks);
    } catch (error) {
      console.error('Error showing reward ad:', error);
      // Fallback to simulation if real ad fails
      console.log('[FALLBACK] Using simulation due to error');
      callbacks.onAdError?.(error instanceof Error ? error.message : 'Unknown error');
      return this.simulateAd(callbacks);
    }
  }

  /**
   * Show AdSense Interstitial Ad (Full-screen ad)
   * This is the closest to reward ads using AdSense
   */
  private async showInterstitialAd(callbacks: AdRewardCallback): Promise<void> {
    return new Promise((resolve) => {
      // Create full-screen ad container
      const adContainer = document.createElement('div');
      adContainer.id = 'adsense-interstitial-container';
      adContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      // Create ad slot
      const adSlot = document.createElement('ins');
      adSlot.className = 'adsbygoogle';
      adSlot.style.cssText = 'display: block; width: 100%; height: 100%;';
      adSlot.setAttribute('data-ad-client', this.adUnitId.split('/')[0]);
      adSlot.setAttribute('data-ad-slot', this.adUnitId.split('/')[1]);
      adSlot.setAttribute('data-ad-format', 'auto');
      adSlot.setAttribute('data-full-width-responsive', 'true');

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 24px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10001;
      `;

      adContainer.appendChild(adSlot);
      adContainer.appendChild(closeBtn);
      document.body.appendChild(adContainer);

      // Push ad to AdSense
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('Error pushing ad:', e);
      }

      let adClosed = false;
      const closeAd = () => {
        if (adClosed) return;
        adClosed = true;
        document.body.removeChild(adContainer);
        callbacks.onRewardEarned?.();
        callbacks.onAdClosed?.();
        resolve();
      };

      // Close button handler
      closeBtn.addEventListener('click', () => {
        // Wait a bit before allowing close (ensures ad was viewed)
        setTimeout(closeAd, 500);
      });

      // Auto-close after reasonable time (fallback)
      setTimeout(() => {
        if (document.body.contains(adContainer) && !adClosed) {
          closeAd();
        }
      }, 30000); // 30 seconds max
    });
  }

  /**
   * Simulate ad watching (for development/testing)
   * Replace this with actual ad implementation
   */
  private async simulateAd(callbacks: AdRewardCallback): Promise<void> {
    // Show a simple modal simulating ad
    const adModal = document.createElement('div');
    adModal.id = 'ad-modal-simulator';
    adModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      font-family: Arial, sans-serif;
    `;
    
    adModal.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <h2 style="margin-bottom: 20px;">📺 Ad Playing...</h2>
        <div style="width: 300px; height: 200px; background: #333; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 20px auto;">
          <div style="font-size: 48px;">📺</div>
        </div>
        <p style="margin-top: 20px; opacity: 0.7;">Watch this ad to get your reward!</p>
        <button id="ad-close-btn" style="margin-top: 20px; padding: 10px 30px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
          Skip Ad (Dev Mode)
        </button>
      </div>
    `;

    document.body.appendChild(adModal);

    return new Promise((resolve) => {
      const closeBtn = document.getElementById('ad-close-btn');
      const closeAd = () => {
        document.body.removeChild(adModal);
        callbacks.onRewardEarned?.();
        callbacks.onAdClosed?.();
        resolve();
      };

      closeBtn?.addEventListener('click', closeAd);

      // Auto-close after 3 seconds (simulating ad)
      setTimeout(() => {
        if (document.body.contains(adModal)) {
          closeAd();
        }
      }, 3000);
    });
  }
}

// Singleton instance
let adServiceInstance: AdService | null = null;

/**
 * Initialize ad service
 * Call this once at app startup
 */
export function initializeAdService(adUnitId?: string): AdService {
  if (!adServiceInstance) {
    adServiceInstance = new GoogleAdSenseService(adUnitId);
  }
  return adServiceInstance;
}

/**
 * Get the ad service instance
 */
export function getAdService(): AdService {
  if (!adServiceInstance) {
    adServiceInstance = new GoogleAdSenseService("ca-pub-6675452209717085");
  }
  return adServiceInstance;
}

/**
 * Show reward ad and handle callbacks
 * Convenience function for easy usage
 */
export async function showRewardAd(
  rewardType: string,
  callbacks: AdRewardCallback
): Promise<void> {
  const service = getAdService();
  await service.preloadAds();
  return service.showRewardAd(rewardType, callbacks);
}
