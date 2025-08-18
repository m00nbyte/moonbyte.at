import { initializeConsent } from '@functions/consent';
import { initializeStack } from '@functions/stack';
import { initializeServices } from '@functions/services';
import { initializeRepos } from '@root/functions/repos';
import { initializeClients } from '@functions/clients';
import { initializeTestimonials } from '@functions/testimonials';
import { initializeForm } from '@functions/form';

import type { MainConfig } from '@root/types';

/**
 * Replays a video when it ends.
 *
 * @returns {void} This function has no output.
 */
const replayVideo = (): void => {
    const video = document.querySelector<HTMLVideoElement>('#profile-video');
    if (!video) return;

    video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
    });
};

/**
 * Adds glitch effects to multiple elements.
 *
 * @returns {void} This function has no output.
 */
const addGlitchEffects = (): void => {
    if (window.PowerGlitch) {
        const glitchElements = [
            {
                selector: '#nav_links a',
                options: { playMode: 'hover' }
            },
            {
                selector: '#landing-title',
                options: {
                    timing: {
                        duration: 4000
                    }
                }
            },
            {
                selector: '#profile-video',
                options: {
                    timing: {
                        duration: 6000
                    },
                    shake: {
                        amplitudeX: 0.02,
                        amplitudeY: 0.02
                    }
                }
            },
            {
                selector: '#footer-heart',
                options: {
                    timing: {
                        duration: 4000
                    }
                }
            }
        ];

        glitchElements.forEach(({ selector, options }) => window.PowerGlitch.glitch(selector, options));
    }
};

/**
 * Protects an email address displayed on the webpage by encoding it to prevent
 * web scrapers from harvesting the email. The email is encoded in a way that
 * it appears as text but is converted back to a clickable mailto link when clicked.
 *
 * @returns {void} This function has no output.
 */
const protectEmail = (): void => {
    const linkElement = document.querySelector<HTMLLinkElement>('.contact_email');
    if (!linkElement) return;

    /**
     * Handles the first click event on the email element. It decodes the email address and updates the element.
     *
     * @returns {void} This function has no output.
     */
    const unlockLink = (): void => {
        const encodedEmail = <string>linkElement.textContent;
        const decodedEmail = encodedEmail.replace('[at]', String.fromCharCode(64)).replace('[dot]', String.fromCharCode(46));

        linkElement.href = `mailto:${decodedEmail}`;
        linkElement.textContent = decodedEmail;

        linkElement.removeEventListener('click', unlockLink);
    };

    linkElement.addEventListener('click', unlockLink);
};

/**
 * Delays the initialization of the components until the user interacts with the page.
 *
 * @param {MainConfig} config - The main config for all components.
 * @returns {void} This function has no output.
 */
const delayRender = ({ consent, stack, services, github: { user, repos }, clients, testimonials, form }: MainConfig): void => {
    const interactionEvents = ['mousemove', 'click', 'keydown', 'touchstart', 'scroll'];
    let interactionHappened = false;

    const handleInteraction = () => {
        if (!interactionHappened) {
            for (const event of interactionEvents) {
                document.removeEventListener(event, handleInteraction);
            }

            interactionHappened = true;

            initializeConsent(consent);

            if (window.location.pathname === '/') {
                initializeStack(stack);
                initializeServices(services);
                initializeRepos(user, repos);
                initializeClients(clients);
                initializeTestimonials(testimonials);
                initializeForm(form);
            }
        }
    };

    for (const event of interactionEvents) {
        document.addEventListener(event, handleInteraction);
    }
};

/**
 * Renders the page based on the provided configuration.
 *
 * @param {MainConfig} config - The main config for all components.
 * @returns {void} This function has no output.
 */
const renderPage = (config: MainConfig): void => {
    const { stars, ...restConfig } = config;

    if (window.location.pathname === '/') {
        window.animatedStarField(config.stars);
        protectEmail();
        replayVideo();
        addGlitchEffects();
    }

    delayRender(<MainConfig>restConfig);
};

export { renderPage };
