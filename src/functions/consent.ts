import type { ConsentOptions, ConsentText } from '@root/types';

declare const CookieConsent: {
    run: (config: ConsentOptions) => void;
    show: () => void;
    showPreferences: () => void;
    getCookie: () => {
        consentId: string;
    };
    getUserPreferences: () => {
        acceptType: string;
        acceptedCategories: string;
        rejectedCategories: string;
    };
    acceptedService: (param1: string, param2: string) => boolean;
};

/**
 * Initializes the cookie consent settings and manages the user consent.
 *
 * @param {ConsentText} strings - An object containing localized strings for the consent modals and messages.
 * @returns {void} This function has no output.
 */
const initializeConsent = (strings: ConsentText): void => {
    window.dataLayer = window.dataLayer || [];

    window.gtag = function () {
        window.dataLayer.push(arguments);
    };

    CookieConsent.run({
        revision: 0,
        autoShow: window.location.pathname === '/',
        disablePageInteraction: false,
        guiOptions: {
            consentModal: {
                layout: 'cloud',
                position: 'bottom center',
                equalWeightButtons: false,
                flipButtons: false
            },
            preferencesModal: {
                layout: 'box',
                position: 'center',
                equalWeightButtons: false,
                flipButtons: true
            }
        },
        categories: {
            necessary: {
                readOnly: true
            },
            functionality: {},
            analytics: {
                services: {
                    google_analytics_4: {
                        label: 'Google Analytics 4',
                        onAccept: () => {
                            window.gtag('consent', 'update', {
                                analytics_storage: 'granted'
                            });
                        },
                        onReject: () => {
                            window.gtag('consent', 'update', {
                                analytics_storage: 'denied'
                            });
                        },
                        cookies: [
                            {
                                name: /^(_ga|_gid)/
                            }
                        ]
                    }
                }
            },
            marketing: {}
        },
        language: strings
    });

    window.gtag('consent', 'default', {
        analytics_storage: CookieConsent.acceptedService('google_analytics_4', 'analytics') ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
    });

    const cookiePreferencesButton = document.querySelector<HTMLButtonElement>('#cookie_preferences');
    cookiePreferencesButton?.addEventListener('click', CookieConsent.showPreferences);
};

/**
 * Delays the initialization of the consent modal until the user interacts with the page.
 *
 * @param {ConsentText} consent - The consent text object used in the cookie consent modals.
 * @returns {void} This function has no output.
 */
const delayConsent = (consent: ConsentText): void => {
    const interactionEvents = ['mousemove', 'click', 'keydown', 'touchstart', 'scroll'];
    let interactionHappened = false;

    const handleInteraction = () => {
        if (!interactionHappened) {
            interactionEvents.forEach((event) => document.removeEventListener(event, handleInteraction));
            interactionHappened = true;

            initializeConsent(consent);
        }
    };

    interactionEvents.forEach((event) => document.addEventListener(event, handleInteraction));
};

export { initializeConsent, delayConsent };
