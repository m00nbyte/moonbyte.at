import type { TestimonialList, TestimonialObject } from '@root/types';

/**
 * Renders the testimonials within the given container with modern styling and animations.
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
        container.innerHTML += `
        <div class="testimonial-item opacity-0 transition-all group relative h-full overflow-hidden bg-stone-800 p-4">
            <div class="flex flex-col h-full gap-4">
                <div class="flex items-center justify-between gap-4">
                    <h4 class="text-lg font-bold">${name}</h4>
                    <div class="flex justify-center gap-1 text-xl text-amber-300">
                        ${Array.from(
                            { length: 5 },
                            (_, i) =>
                                `<span class="${i < rating ? 'icon-[mdi--star]' : 'icon-[mdi--star-outline]'} h-5 w-5"></span>`
                        ).join('')}
                    </div>
                </div>
                <p class="text-stone-100 flex-grow">${text}</p>
            </div>
        </div>`;
    }

    setTimeout(() => {
        const items = container.querySelectorAll('.testimonial-item');
        items.forEach((item, index) => {
            item.classList.add('opacity-100', 'translate-y-0');
            (item as HTMLElement).style.transitionDelay = `${index * 100}ms`;
        });
    }, 50);
};

/**
 * Initializes the testimonial sliders with responsive layout and navigation controls.
 *
 * @param {TestimonialList} list - The list of testimonials to display.
 * @returns {void} This function has no output.
 */
const initializeTestimonials = (list: TestimonialList): void => {
    const container = document.querySelector<HTMLDivElement>('#testimonials_grid');
    const prevButton = document.querySelector<HTMLButtonElement>('#testimonials_prev');
    const nextButton = document.querySelector<HTMLButtonElement>('#testimonials_next');

    if (!container || !prevButton || !nextButton) return;

    const setupGridColumns = () => {
        if (window.innerWidth < 768) {
            container.classList.add('grid-cols-1');
            container.classList.remove('grid-cols-2', 'grid-cols-3');
            return 1;
        } else if (window.innerWidth < 1024) {
            container.classList.add('grid-cols-2');
            container.classList.remove('grid-cols-1', 'grid-cols-3');
            return 2;
        } else {
            container.classList.add('grid-cols-3');
            container.classList.remove('grid-cols-1', 'grid-cols-2');
            return 3;
        }
    };

    container.classList.add('grid', 'gap-4');
    let itemsPerPage = setupGridColumns();
    let currentIndex = 0;

    const renderItems = () => {
        itemsPerPage = setupGridColumns();
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
