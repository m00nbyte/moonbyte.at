import { initializeConsent } from '@functions/consent';
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
const delayRender = (config: MainConfig): void => {
    const { consent } = config;

    const interactionEvents = ['mousemove', 'click', 'keydown', 'touchstart', 'scroll'];
    let interactionHappened = false;

    const handleInteraction = () => {
        if (!interactionHappened) {
            interactionEvents.forEach((event) => document.removeEventListener(event, handleInteraction));
            interactionHappened = true;

            initializeConsent(consent);

            if (window.location.pathname === '/') {
                const { stack, services, repos, clients, form } = config;

                const components: { [key: string]: () => void } = {
                    stack: () => initializeStack(stack),
                    services: () => initializeServices(services),
                    repos: () => initializeRepos(repos),
                    clients: () => initializeClients(clients),
                    form: () => initializeForm(form)
                };

                for (const key in components) {
                    if (components.hasOwnProperty(key)) {
                        components[key]?.();
                    }
                }
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
    const emailElement = document.querySelector<HTMLLinkElement>('.contact_email');
    if (!emailElement) return;

    /**
     * Handles the click event on the email element. It decodes the encoded email
     * and updates the href attribute to create a mailto link.
     *
     * @returns {void} This function has no output.
     */
    const handleClick = (): void => {
        const encodedEmail = <string>emailElement.textContent;
        const decodedEmail = encodedEmail.replace('[at]', String.fromCharCode(64)).replace('[dot]', String.fromCharCode(46));

        emailElement.href = `mailto:${decodedEmail}`;
        emailElement.textContent = decodedEmail;

        emailElement.removeEventListener('click', handleClick);
    };

    emailElement.addEventListener('click', handleClick);
};

export { delayRender, protectEmail };
