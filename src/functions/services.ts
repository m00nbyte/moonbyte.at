import type { ServiceList } from '@root/types';

/**
 * Initializes the services grid by rendering service cards based on the provided list of services.
 *
 * @param {ServiceList} list - The list of services to display.
 * @returns {void} This function has no output.
 */
const initializeServices = (list: ServiceList): void => {
    const servicesContainer = document.querySelector<HTMLDivElement>('#services_grid');
    if (!servicesContainer) return;

    list.forEach((service) => {
        const { icon, title, description } = service;

        servicesContainer.innerHTML += `<div class="flex flex-col h-full gap-2 bg-opacity-60">
            <div class="flex flex-row items-center gap-4 text-2xl">
                <span class="${icon} h-7 w-7"></span>
                <span class="font-bold tracking-tight">${title}</span>
            </div>
            <p class="flex-grow text-base leading-relaxed text-justify">${description}</p>
        </div>`;
    });
};

export { initializeServices };
