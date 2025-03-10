import type { TestimonialList, TestimonialObject } from '@root/types';

/**
 * Renders the testimonials within the given container.
 *
 * @param {HTMLDivElement} container - The container to render the testimonials in.
 * @param {TestimonialList} list - The list of testimonials to display.
 * @param {number} startIndex - The starting index for rendering testimonials.
 * @param {number} itemsPerPage - The number of items to display per page.
 * @returns {void} This function has no output.
 */
const renderTestimonials = (
    container: HTMLDivElement,
    list: TestimonialList,
    startIndex: number,
    itemsPerPage: number
): void => {
    container.innerHTML = '';
    const visibleItems = [];

    for (let i = 0; i < itemsPerPage; i++) {
        const index = (startIndex + i) % list.length;
        visibleItems.push(<TestimonialObject>list[index]);
    }

    for (const { rating, name, text } of visibleItems) {
        container.innerHTML += `<div class="px-5 py-4 rounded-md bg-stone-700 testimonial-item opacity-0 transition-opacity duration-500">
            <div class="flex items-center justify-between gap-4">
                <p class="mt-0.5 text-lg font-bold">${name}</p>
                <div class="flex justify-center gap-0.5 text-xl text-amber-300">
                    ${Array.from(
                        { length: 5 },
                        (_, i) => `<span class="${i < rating ? 'icon-[mdi--star]' : 'icon-[mdi--star-outline]'}"></span>`
                    ).join('')}
                </div>
            </div>
            <p class="mt-4 text-sm text-justify">${text}</p>
        </div>`;
    }

    setTimeout(() => {
        const items = container.querySelectorAll('.testimonial-item');
        items.forEach((item) => item.classList.add('opacity-100'));
    }, 50);
};

/**
 * Initializes the testimonial sliders for clients and trainers.
 *
 * @param {TestimonialList} list - The list of testimonials to display.
 * @returns {void} This function has no output.
 */
const initializeTestimonials = (list: TestimonialList): void => {
    const container = document.querySelector<HTMLDivElement>('#testimonials_grid');
    const prevButton = document.querySelector<HTMLButtonElement>('#testimonials_prev');
    const nextButton = document.querySelector<HTMLButtonElement>('#testimonials_next');

    if (!container || !prevButton || !nextButton) return;

    let currentIndex = 0;
    let itemsPerPage = 6;

    const renderItems = () => {
        if (window.matchMedia('(max-width: 768px)').matches) {
            itemsPerPage = 1;
        } else if (window.matchMedia('(max-width: 1024px)').matches) {
            itemsPerPage = 4;
        } else {
            itemsPerPage = 6;
        }

        renderTestimonials(container, list, currentIndex, itemsPerPage);
    };

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - itemsPerPage + list.length) % list.length;
        renderItems();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + itemsPerPage) % list.length;
        renderItems();
    });

    window.addEventListener('resize', renderItems);

    renderItems();
};

export { initializeTestimonials };
