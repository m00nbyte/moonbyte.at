import type { StarConfig, StarsConfig } from '@root/types';

/**
 * Animates the stars in the given scrolling container based on the specified configuration.
 *
 * @param {StarsConfig} config - Configuration for the star animation, including direction and speed.
 * @param {HTMLDivElement} scrollingStarsContainer - The container where the stars will be animated.
 * @returns {void} This function has no output.
 */
const animateStars = (config: StarsConfig, scrollingStarsContainer: HTMLDivElement): void => {
    const { direction = 'up', speed = 50 } = config;

    const starsContainers = scrollingStarsContainer.querySelectorAll<HTMLDivElement>(
        Array.from({ length: 2 }, (_, index) => `#star_container${index + 1}`).join(', ')
    );

    /**
     * Animates the star containers by updating their vertical position based on the configured direction and speed.
     * This function is called recursively using requestAnimationFrame to create a smooth animation effect.
     */
    const animate = () => {
        const speedPerFrame = speed / (60 * 100);

        const movement = direction === 'up' ? -speedPerFrame : speedPerFrame;

        const boundaries = {
            min: -100,
            max: 100
        };

        starsContainers.forEach((star) => {
            let pos = parseFloat(star.style.top) + movement;

            pos = direction === 'up' && pos <= boundaries.min ? boundaries.max : pos >= boundaries.max ? boundaries.min : pos;

            star.style.top = `${pos}%`;
        });

        requestAnimationFrame(animate);
    };

    const initialPositions = direction === 'up' ? [0, 100] : [100, 0];
    starsContainers.forEach((star, index) => (star.style.top = `${initialPositions[index]}%`));

    animate();
};

/**
 * Merges two star configurations deeply, allowing for nested properties.
 *
 * @param {StarsConfig} target - The target configuration to merge into.
 * @param {Partial<StarsConfig>} source - The source configuration to merge from.
 * @returns {StarsConfig} The merged configuration.
 */
const deepMergeConfig = <StarsConfig>(target: StarsConfig, source: Partial<StarsConfig>): StarsConfig => {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            const targetValue = target[key];
            const sourceValue = source[key];

            const isObject = (value: any): value is object => value !== null && typeof value === 'object';

            target[key] = (
                isObject(targetValue) && isObject(sourceValue) ? deepMergeConfig(targetValue, sourceValue) : sourceValue
            ) as StarsConfig[Extract<keyof StarsConfig, string>];
        }
    }

    return target; // Return the merged target configuration
};

/**
 * Initializes the star animation with the provided options.
 *
 * @param {Partial<StarsConfig>} options - Configuration options for the star animation.
 * @returns {void} This function has no output.
 */
const initializeStars = (options: Partial<StarsConfig>): void => {
    const mergedConfig: StarsConfig = deepMergeConfig(
        {
            direction: 'down',
            speed: 500,
            stars: {
                small: {
                    count: 100,
                    blinkDuration: 2
                },
                medium: {
                    count: 50,
                    blinkDuration: 2
                },
                large: {
                    count: 50,
                    blinkDuration: 2
                }
            }
        },
        options
    );

    if (!mergedConfig.container) return;

    const starsContainer = document.querySelector<HTMLDivElement>(mergedConfig.container);
    if (!starsContainer) return;

    Array.from({ length: 2 }).forEach((_, index) => {
        const starContainer = document.createElement('div');
        starContainer.id = `star_container${index + 1}`;
        starContainer.style.top = index === 0 ? '0' : '100%';

        Object.entries(mergedConfig.stars as Record<string, StarConfig>).forEach(([size, { count, blinkDuration }]) => {
            Array.from({ length: count }).forEach(() => {
                const star = document.createElement('div');
                star.className = `stars ${size}`;
                star.style.animation = `blink ${blinkDuration}s infinite`;
                star.style.top = `${Math.random() * 100}vh`;
                star.style.left = `${Math.random() * 100}vw`;
                star.style.animationDelay = `${Math.random() * 2}s`;

                starContainer.appendChild(star);
            });
        });

        starsContainer.appendChild(starContainer);
    });

    animateStars(mergedConfig, starsContainer);
};

export { initializeStars };
