import type { TechStackList } from '@root/types';

/**
 * Initializes the tech stack display by rendering icons based on the provided list of technologies.
 *
 * @param {TechStackList} list - The list of technology stack icons to display.
 * @returns {void} This function has no output.
 */
const initializeStack = (list: TechStackList): void => {
    const stackContainer = document.querySelector<HTMLDivElement>('#tech_stack');
    if (!stackContainer) return;

    list.forEach(({ title, icon }) => {
        const span = document.createElement('span');

        span.title = title;
        span.className = `${icon} h-8 w-8 opacity-70 hover:opacity-100 transition-all cursor-pointer`;

        stackContainer.appendChild(span);
    });
};

export { initializeStack };
