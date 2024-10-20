import type { ClientList } from '@root/types';

/**
 * Initializes a scrolling logo slider with the provided list of clients.
 *
 * @param {ClientList} clients - An array of client objects, each containing the logo URL, title, image source, and CSS classes.
 * @returns {void} This function has no output.
 */
const generateClients = (clients: ClientList): void => {
    const container = document.querySelector<HTMLDivElement>('#logo_slider');
    if (!container) return;

    const logoWrapper = document.createElement('div');
    logoWrapper.className = 'inline-block ml-16 animate-slide-left-infinite group-hover:animation-pause w-max grayscale';

    clients.forEach(
        ({ url, title, img: { src }, classes }) =>
            (logoWrapper.innerHTML += `
            <a href="${url}" target="_blank" title="${title}">
                <img src="${src}" class="inline mx-8 transition-all opacity-80 hover:opacity-100 ${classes}" alt="${title}" />
            </a>
        `)
    );

    const logoWrapperClone = logoWrapper.cloneNode(true) as HTMLDivElement;
    logoWrapperClone.classList.remove('ml-16');

    container.appendChild(logoWrapper);
    container.appendChild(logoWrapperClone);
};

/**
 * Sets up lazy loading for the client slider using Intersection Observer.
 *
 * @param {ClientList} clients - An array of client objects, each containing the logo URL, title, image source, and CSS classes.
 * @returns {void} This function has no output.
 */
const lazyLoadSlider = (clients: ClientList): void => {
    const container = document.querySelector<HTMLDivElement>('#showcase');
    if (!container) return;

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    generateClients(clients);
                    observer.disconnect();
                }
            });
        },
        {
            root: null,
            threshold: 0.1
        }
    );

    observer.observe(container);
};

export { lazyLoadSlider as initializeClients };
