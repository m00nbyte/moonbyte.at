import config from '@root/config.json';

import { initializeNavbar } from '@functions/navbar';
import { delayRender } from '@functions/helpers';

/**
 * This function sets up the navigation bar and initializes various components.
 *
 * @returns {void} This function has no output.
 */
const initPage = (): void => {
    initializeNavbar();
    delayRender(config);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }

    console.log(
        ['\n', '👋 Hi there, fellow developer! Thanks for visiting.', '\n', "I'd love to hear what you think!", '\n\n'].join('')
    );
};

window.onload = initPage;
