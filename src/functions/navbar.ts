let {
    scrollY: lastScrollY,
    location: { pathname: currentPath }
} = window;
let scrollDirection = 'none';
let mobileNavActive = false;
let scrollTimeout: number | null = null;

/**
 * Toggles classes on an HTML element based on a condition.
 *
 * @param {HTMLElement} element - The HTML element to toggle classes on.
 * @param {boolean} condition - The condition to determine which classes to toggle.
 * @param {{ on: string[]; off: string[] }} classes - An object containing arrays of class names to add or remove.
 * @returns {void} This function has no output.
 */
const toggleClasses = (element: HTMLElement, condition: boolean, { on, off }: { on: string[]; off: string[] }): void => {
    element.classList.remove(...(condition ? off : on));
    element.classList.add(...(condition ? on : off));
};

/**
 * Toggles the underline style of navigation links based on the scroll direction.
 *
 * @param {string} scrollDirection - The direction of the scroll (up, down, or none).
 * @returns {void} This function has no output.
 */
const toggleUnderline = (scrollDirection: string): void => {
    const navbarLinks = Array.from(document.querySelectorAll('#navbar a'));

    for (const element of navbarLinks) {
        element.classList.remove('underline-up', 'underline-down', 'underline-none');
        element.classList.add(`underline-${scrollDirection}`);
    }
};

/**
 * Updates the navbar appearance based on the current scroll position.
 *
 * @param {HTMLDivElement} navBar - The navbar element to update.
 * @returns {void} This function has no output.
 */
const updateStickyNavbar = (navBar: HTMLDivElement): void => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    const logoButton = navBar.querySelector<HTMLDivElement>('#logo_button');
    if (!logoButton) return;

    const logoText = logoButton.querySelector<HTMLDivElement>('#logo_text');
    const scrollText = logoButton.querySelector<HTMLDivElement>('#logo_scroll');
    if (!logoText || !scrollText) return;

    const { scrollY: currentScrollY } = window;
    const isScrolled = currentScrollY > 50;

    scrollDirection = currentScrollY > lastScrollY ? 'down' : currentScrollY < lastScrollY ? 'up' : 'none';

    toggleUnderline(scrollDirection);

    const toggleMap = [
        // navbar opacity
        {
            element: navBar,
            condition: isScrolled || currentPath !== '/',
            classes: {
                on: ['bg-opacity-100', 'shadow-md'],
                off: ['bg-opacity-0']
            }
        },
        // logo text (default)
        {
            element: logoText,
            condition: isScrolled,
            classes: {
                on: ['opacity-0', 'z-negative', '-translate-x-3'],
                off: ['opacity-100']
            }
        },
        // logo text (scroll)
        {
            element: scrollText,
            condition: isScrolled,
            classes: {
                on: ['opacity-100'],
                off: ['opacity-0', 'z-negative', '-translate-x-3']
            }
        },
        // logo ga4 event
        {
            element: logoButton,
            condition: !isScrolled,
            classes: {
                on: ['ga-lb'], // default
                off: ['ga-bt'] // scroll
            }
        }
    ];

    for (const { element, condition, classes } of toggleMap) {
        toggleClasses(element, condition, classes);
    }

    lastScrollY = currentScrollY;
    scrollTimeout = window.setTimeout(() => toggleUnderline('none'), 800);
};

/**
 * Observes the specified sections to update the navigation bar's active link
 * based on the section currently in view.
 *
 * @param {HTMLElement[]} sections - The sections to observe.
 * @returns {void} This function has no output.
 */
const observeSections = (sections: HTMLElement[]): void => {
    const observer = new IntersectionObserver(
        (entries) => {
            for (const {
                target: { id: sectionId },
                isIntersecting
            } of entries) {
                const navbarLinks = Array.from(document.querySelectorAll('#navbar a'));
                if (!navbarLinks.length) return;

                toggleUnderline(scrollDirection);

                const [activeLink] = navbarLinks.splice(
                    navbarLinks.findIndex((item) => item.getAttribute('href') === `#${sectionId}`),
                    1
                );

                if (activeLink) {
                    let removeClasses = ['underline-up', 'underline-down', 'underline-none'];
                    let addClasses = [];

                    if (isIntersecting) {
                        addClasses.push(`underline-${scrollDirection}`, 'nav-active');
                    } else {
                        removeClasses.push('nav-active');
                        addClasses.push('underline-none');
                    }

                    activeLink.classList.remove(...removeClasses);
                    activeLink.classList.add(...addClasses);
                }
            }
        },
        {
            root: null,
            threshold: 0.5
        }
    );

    for (const section of sections) {
        observer.observe(section);
    }
};

/**
 * Handles click events on navigation links, scrolling smoothly to the target section.
 *
 * @param {HTMLLinkElement[]} navLinks - The navigation links to update.
 * @param {Event} event - The click event that triggered this handler.
 * @returns {void} This function has no output.
 */
const handleNavLinkClick = (navLinks: HTMLLinkElement[], navToggle: HTMLButtonElement, event: Event): void => {
    event.preventDefault();

    const target = <HTMLAnchorElement>event.target;
    const href = target.getAttribute('href') || '';

    for (const link of navLinks) {
        link.classList.remove('border-white');
    }

    if (href.startsWith('#')) {
        target.classList.add('border-white');

        const targetElement = document.querySelector<HTMLElement>(href);

        if (mobileNavActive) {
            navToggle.click();
        }

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    }
};

/**
 * Adjusts the navigation links' styles based on the current screen size.
 *
 * @param {HTMLDivElement} navLinks - The navigation links container to update.
 * @returns {void} This function has no output.
 */
const handleScreenSize = (navLinks: HTMLDivElement): void => {
    navLinks.className =
        window.innerWidth < 768
            ? mobileNavActive
                ? 'absolute top-0 left-0 flex flex-col items-center justify-center w-screen h-screen gap-16 text-3xl bg-stone-900'
                : 'hidden'
            : 'flex-row hidden gap-8 md:flex';
};

/**
 * Initializes the navigation bar by setting up event listeners and managing its state.
 *
 * @returns {void} This function has no output.
 */
const initializeNavbar = (): void => {
    const navContainer = document.querySelector<HTMLDivElement>('#navbar');
    if (!navContainer) return;

    const logoButton = navContainer.querySelector<HTMLLinkElement>('#logo_button');
    const navRight = navContainer.querySelector<HTMLDivElement>('#nav_links');
    const navAlt = navContainer.querySelector<HTMLDivElement>('#nav_alt');
    const navToggle = navContainer.querySelector<HTMLButtonElement>('#nav_toggle');
    if (!logoButton || !navRight || !navAlt || !navToggle) return;

    window.addEventListener('scroll', () => updateStickyNavbar(navContainer));
    updateStickyNavbar(navContainer);

    if (currentPath === '/') {
        const sections = <HTMLElement[]>Array.from(document.querySelectorAll('section:not(#landing)'));
        if (!sections.length) return;

        observeSections(sections);

        window.addEventListener('resize', () => handleScreenSize(navRight));
        handleScreenSize(navRight);

        const navLinks = <HTMLLinkElement[]>Array.from(document.querySelectorAll('#navbar a'));

        for (const link of navLinks) {
            link.addEventListener('click', (event) => handleNavLinkClick(navLinks, navToggle, event));
        }

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('close');
            mobileNavActive = !mobileNavActive;

            document.body.style.overflow = mobileNavActive ? 'hidden' : '';
            navRight.className = mobileNavActive
                ? 'absolute top-0 left-0 flex flex-col items-center justify-center w-screen h-screen gap-16 text-3xl bg-stone-900'
                : 'hidden';
        });
    } else {
        navRight.remove();
        navToggle.remove();

        navAlt.classList.remove('hidden');
        navAlt.classList.add('flex');

        logoButton.href = '#';
        logoButton.addEventListener('click', (event) => {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

export { initializeNavbar };
