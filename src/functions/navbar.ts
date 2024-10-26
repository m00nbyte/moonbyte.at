let lastScrollY = window.scrollY;
let scrollDirection = 'none';
// let scrollPercent = 0;
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

    navbarLinks.forEach((element) => {
        element.classList.remove('underline-up', 'underline-down', 'underline-none');
        element.classList.add(`underline-${scrollDirection}`);
    });
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

    const logoButton = navBar.querySelector('#logo_button') as HTMLDivElement;
    const logoText = logoButton.querySelector('#logo_text') as HTMLDivElement;
    const scrollText = logoButton.querySelector('#logo_scroll') as HTMLDivElement;

    const currentScrollY = window.scrollY;
    const isScrolled = currentScrollY > 50;

    scrollDirection = currentScrollY > lastScrollY ? 'down' : currentScrollY < lastScrollY ? 'up' : 'none';

    toggleUnderline(scrollDirection);

    const toggleMap = [
        {
            element: logoButton,
            condition: !isScrolled,
            classes: {
                on: ['ga-lb'],
                off: ['ga-bt']
            }
        },
        {
            element: navBar,
            condition: isScrolled || window.location.pathname !== '/',
            classes: {
                on: ['bg-opacity-100', 'shadow-md'],
                off: ['bg-opacity-0']
            }
        },
        {
            element: logoText,
            condition: isScrolled,
            classes: {
                on: ['opacity-0', 'z-negative', '-translate-x-3'],
                off: ['opacity-100']
            }
        },
        {
            element: scrollText,
            condition: isScrolled,
            classes: {
                on: ['opacity-100'],
                off: ['opacity-0', 'z-negative', '-translate-x-3']
            }
        }
    ];

    toggleMap.forEach(({ element, condition, classes }) => toggleClasses(element, condition, classes));

    lastScrollY = currentScrollY;
    scrollTimeout = window.setTimeout(() => toggleUnderline('none'), 800);
};

/**
 * Observes the specified sections to update the navigation bar's active link
 * based on the section currently in view.
 *
 * @param {NodeListOf<HTMLElement>} sections - The sections to observe.
 * @returns {void} This function has no output.
 */
const observeSections = (sections: NodeListOf<HTMLElement>): void => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const navbarLinks = Array.from(document.querySelectorAll('#navbar a'));

                toggleUnderline(scrollDirection);

                const [activeLink] = navbarLinks.splice(
                    navbarLinks.findIndex((item) => item.getAttribute('href') === `#${entry.target.id}`),
                    1
                );

                if (activeLink) {
                    let removeClasses = ['underline-up', 'underline-down', 'underline-none'];
                    let addClasses = [];

                    if (entry.isIntersecting) {
                        addClasses.push(`underline-${scrollDirection}`, 'nav-active');
                    } else {
                        removeClasses.push('nav-active');
                        addClasses.push('underline-none');
                    }

                    activeLink.classList.remove(...removeClasses);
                    activeLink.classList.add(...addClasses);
                }
            });
        },
        {
            root: null,
            threshold: 0.5
        }
    );

    sections.forEach((section) => observer.observe(section));
};

/**
 * Handles click events on navigation links, scrolling smoothly to the target section.
 *
 * @param {NodeListOf<HTMLLinkElement>} navLinks - The navigation links to update.
 * @param {Event} event - The click event that triggered this handler.
 * @returns {void} This function has no output.
 */
const handleNavLinkClick = (navLinks: NodeListOf<HTMLLinkElement>, navToggle: HTMLButtonElement, event: Event): void => {
    event.preventDefault();

    const target = event.target as HTMLAnchorElement;
    const href = target.getAttribute('href') || '';

    navLinks.forEach((link) => link.classList.remove('border-white'));

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

    if (window.location.pathname === '/') {
        const sections = document.querySelectorAll('section:not(#landing)') as NodeListOf<HTMLElement>;
        observeSections(sections);

        window.addEventListener('resize', () => handleScreenSize(navRight));
        handleScreenSize(navRight);

        const navLinks = document.querySelectorAll('#navbar a') as NodeListOf<HTMLLinkElement>;
        navLinks.forEach((link) => link.addEventListener('click', (event) => handleNavLinkClick(navLinks, navToggle, event)));

        const burgerMenu = document.querySelector<HTMLDivElement>('#burger-menu');
        if (!burgerMenu) return;

        navToggle.addEventListener('click', () => {
            mobileNavActive = !mobileNavActive;
            burgerMenu.classList.toggle('close');

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
