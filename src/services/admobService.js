import { AdMob, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob';

/**
 * Servicio para manejar la publicidad de Google AdMob en dispositivos móviles.
 */
const admobService = {
    /**
     * Inicializa el plugin de AdMob.
     */
    async initialize() {
        try {
            await AdMob.initialize({
                requestTrackingAuthorization: true,
                initializeForTesting: false, // Cambiado a false para producción
            });
            console.log('✅ AdMob Initialized');
        } catch (e) {
            console.error('❌ Error initializing AdMob:', e);
        }
    },

    /**
     * Muestra un banner publicitario.
     * @param {string} adId - El ID del bloque de anuncios (Banner).
     */
    async showBanner(adId = 'ca-app-pub-6763700053445538/8779371173') { // ID real del usuario
        try {
            const options = {
                adId: adId,
                adSize: BannerAdSize.BANNER,
                position: BannerAdPosition.BOTTOM_CENTER,
                margin: 0,
                isTesting: false
            };
            await AdMob.showBanner(options);
            console.log('✅ Banner Shown');
        } catch (e) {
            console.error('❌ Error showing banner:', e);
        }
    },

    /**
     * Oculta el banner actual.
     */
    async hideBanner() {
        try {
            await AdMob.hideBanner();
        } catch (e) {
            console.error('❌ Error hiding banner:', e);
        }
    },

    /**
     * Muestra un anuncio intersticial (a pantalla completa).
     * @param {string} adId - El ID del bloque de anuncios (Interstitial).
     */
    async showInterstitial(adId = 'ca-app-pub-6763700053445538/9273544656') { // ID real del usuario
        try {
            await AdMob.prepareInterstitial({
                adId: adId,
                isTesting: false
            });
            await AdMob.showInterstitial();
            console.log('✅ Interstitial Shown');
        } catch (e) {
            console.error('❌ Error showing interstitial:', e);
        }
    },

    /**
     * Muestra un anuncio de inicio (App Open).
     * @param {string} adId - El ID del bloque de anuncios (App Open).
     */
    async showAppOpenAd(adId = 'ca-app-pub-6763700053445538/1626811315') { // ID real del usuario
        try {
            await AdMob.prepareAppOpenAd({
                adId: adId,
                isTesting: false
            });
            await AdMob.showAppOpenAd();
            console.log('✅ App Open Ad Shown');
        } catch (e) {
            console.error('❌ Error showing App Open ad:', e);
        }
    }
};

export default admobService;
