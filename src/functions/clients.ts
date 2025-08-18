import type { ClientList } from '@root/types';

/**
 * Calculates the animation duration for the slider, depending on the total number of logos.
 *
 * @param {number} total - The total number of logo objects.
 * @returns {void} This function has no output.
 */
const setAnimationDuration = (total: number): void => {
    const container = document.querySelector<HTMLDivElement>('#logo_slider');
    if (!container) return;

    const durationPerItem = 1.5;
    const totalDuration = total * durationPerItem;
    container.style.setProperty('--animation-duration', `${totalDuration}s`);
};

/**
 * Initializes a scrolling logo slider with the provided list of clients.
 *
 * @param {ClientList} clients - An array of client objects.
 * @returns {void} This function has no output.
 */
const generateClients = (clients: ClientList): void => {
    const container = document.querySelector<HTMLDivElement>('#logo_slider');
    if (!container) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'inline-flex items-center ml-16 slide-left-infinite group-hover:animation-pause w-max';

    setAnimationDuration(clients.length);

    for (const { url, title, src, classes } of clients) {
        wrapper.innerHTML += `
        <a href="${url}" target="_blank" title="${title}" class="mx-8 transition-all hover:scale-110">
            <img src="${src}"
                 class="h-12 w-auto max-w-none opacity-80 grayscale transition-all hover:opacity-100 hover:grayscale-0 ${classes}"
                 alt="${title}"
                 loading="lazy" />
        </a>`;
    }

    const wrapperClone = <HTMLDivElement>wrapper.cloneNode(true);
    wrapperClone.classList.remove('ml-16');

    container.appendChild(wrapper);
    container.appendChild(wrapperClone);
};

/**
 * Sets up lazy loading for the client slider using Intersection Observer.
 *
 * @param {ClientList} clients - An array of client objects.
 * @returns {void} This function has no output.
 */
const initializeClients = (clients: ClientList): void => {
    const container = document.querySelector<HTMLDivElement>('#logo_slider');
    if (!container) return;

    const section = container.closest('section');
    if (!section) return;

    const observer = new IntersectionObserver(
        (entries, observer) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    generateClients(clients);
                    observer.disconnect();
                    break;
                }
            }
        },
        {
            root: null,
            threshold: 0.1
        }
    );

    observer.observe(section);
};

export { initializeClients };
