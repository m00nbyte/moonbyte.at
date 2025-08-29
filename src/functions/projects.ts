import type { ProjectList } from '@root/types';

/**
 * Initializes the projects grid by rendering project cards based on the provided list of projects.
 *
 * @param {ProjectList} list - The list of projects to display.
 * @returns {void} This function has no output.
 */
const initializeProjects = (list: ProjectList): void => {
    const projectsContainer = document.querySelector<HTMLDivElement>('#projects_grid');
    if (!projectsContainer) return;

    for (const { href, imageSrc, alt, title, subtitle } of list) {
        projectsContainer.innerHTML += `
        <a
            href="${href}"
            target="_blank"
            class="relative flex w-full h-48 rounded-lg shadow-xl group"
        >
            <div
                class="z-10 w-full h-full overflow-hidden transition duration-300 ease-in-out border rounded-lg border-stone-700 opacity-60 group-hover:opacity-100"
            >
                <img
                    src="${imageSrc}"
                    class="block object-cover object-left-top w-full h-full transition duration-300 transform scale-100 opacity-100 animate-fade-in group-hover:scale-110"
                    alt="${alt}"
                />
            </div>
            <div
                class="absolute bottom-0 z-20 pb-4 m-0 transition duration-300 ease-in-out ps-4 group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110"
            >
                <h1 class="font-serif text-2xl font-bold text-white shadow-xl">${title}</h1>
                <h1 class="text-sm font-light text-gray-200 shadow-xl">${subtitle}</h1>
            </div>
        </a>`;
    }
};

export { initializeProjects };
