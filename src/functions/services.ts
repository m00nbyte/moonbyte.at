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

    for (const { icon, title, description } of list) {
        servicesContainer.innerHTML += `
        <div class="group relative h-full overflow-hidden border border-stone-700 bg-stone-700 p-4 transition-all">
            <div class="flex flex-col h-full gap-4">
                <div class="flex flex-row items-center gap-4">
                    <span class="${icon} h-7 w-7"></span>
                    <span class="text-2xl font-bold tracking-tight">
                        ${title}
                    </span>
                </div>
                <p class="flex-grow text-base leading-relaxed text-justify text-stone-100">
                    ${description}
                </p>
            </div>
        </div>`;
    }
};

export { initializeServices };
