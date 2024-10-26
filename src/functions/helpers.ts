import { initializeConsent } from '@functions/consent';
import { initializeStars } from '@functions/stars';
import { initializeStack } from '@functions/stack';
import { initializeServices } from '@functions/services';
import { initializeRepos } from '@functions/repos';
import { initializeClients } from '@functions/clients';
import { initializeForm } from '@functions/form';

import type { MainConfig } from '@root/types';

/**
 * Delays the initialization of the components until the user interacts with the page.
 *
 * @param {MainConfig} config - The main config for all components.
 * @returns {void} This function has no output.
 */
const delayRender = ({ consent, stars, stack, services, repos, clients, form }: MainConfig): void => {
    const interactionEvents = ['mousemove', 'click', 'keydown', 'touchstart', 'scroll'];
    let interactionHappened = false;

    // skip delay
    if (window.location.pathname === '/') {
        initializeStars(stars);
        protectEmail();
    }

    const handleInteraction = () => {
        if (!interactionHappened) {
            interactionEvents.forEach((event) => document.removeEventListener(event, handleInteraction));
            interactionHappened = true;

            initializeConsent(consent);

            if (window.location.pathname === '/') {
                initializeStack(stack);
                initializeServices(services);
                initializeRepos(repos);
                initializeClients(clients);
                initializeForm(form);
            }
        }
    };

    interactionEvents.forEach((event) => document.addEventListener(event, handleInteraction));
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

export { delayRender, protectEmail };
