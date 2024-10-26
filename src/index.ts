import config from '@root/config.json';

import { initializeNavbar } from '@functions/navbar';
import { initializeStars } from '@functions/stars';
import { delayRender, protectEmail } from '@functions/helpers';

/**
 * Initializes the application on window load.
 * This function sets up the navigation bar, manages consent delay,
 * and initializes various components based on the current path.
 */
window.onload = () => {
    initializeNavbar();
    protectEmail();

    if (window.location.pathname === '/') {
        const { stars } = config;
        initializeStars(stars);
    }

    delayRender(config);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }

    console.log(
        ['\n', '👋 Hi there, fellow developer! Thanks for visiting.', '\n', "I'd love to hear what you think!", '\n\n'].join('')
    );
};
