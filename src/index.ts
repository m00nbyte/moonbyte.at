import config from '@root/config.json';

import { delayConsent } from '@functions/consent';
import { initializeNavbar } from '@functions/navbar';
import { initializeStars } from '@functions/stars';
import { initializeStack } from '@functions/stack';
import { initializeRepos } from '@functions/repos';
import { initializeClients } from '@functions/clients';
import { initializeForm } from '@functions/form';
import { protectEmail } from '@functions/helpers';

import type { MainConfig, ConsentText, TechStackList, RepoList, ClientList, FormText, StarsConfig } from '@root/types';

/**
 * Initializes the application on window load.
 * This function sets up the navigation bar, manages consent delay,
 * and initializes various components based on the current path.
 */
window.onload = () => {
    const pageConfig = <MainConfig>config;
    const { consent } = pageConfig;
    delayConsent(consent as ConsentText);

    initializeNavbar();

    if (window.location.pathname === '/') {
        const { stars, stack, repos, clients, form } = pageConfig;

        initializeStars(stars as StarsConfig);
        initializeStack(stack as TechStackList);
        initializeRepos(repos as RepoList);
        initializeClients(clients as ClientList);
        initializeForm(form as FormText);

        protectEmail();
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }

    console.log(
        ['\n', '👋 Hi there, fellow developer! Thanks for visiting.', '\n', "I'd love to hear what you think!", '\n\n'].join('')
    );
};
