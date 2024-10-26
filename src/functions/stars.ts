import type { StarConfig, StarsConfig } from '@root/types';

/**
 * Animates the star containers by updating their vertical position based on the configured direction and speed.
 * This function is called recursively using requestAnimationFrame to create a smooth animation effect.
 *
 * @param {HTMLDivElement[]} containers - The containers to animate.
 * @param {string} direction - The movement direction of the containers.
 * @param {number} speed - The movement speed of the containers.
 * @returns {void} This function has no output.
 */
const animateStars = (containers: HTMLDivElement[], direction: string, speed: number): void => {
    const speedPerFrame = speed / (60 * 100);
    const movement = direction === 'up' ? -speedPerFrame : speedPerFrame;

    const boundaries = {
        min: -100,
        max: 100
    };

    containers.forEach((star) => {
        let pos = parseFloat(star.style.top) + movement;

        star.style.top = `${
            direction === 'up' && pos <= boundaries.min ? boundaries.max : pos >= boundaries.max ? boundaries.min : pos
        }%`;
    });

    requestAnimationFrame(() => animateStars(containers, direction, speed));
};

/**
 * Animates the stars in the given scrolling container based on the specified configuration.
 *
 * @param {StarsConfig} config - Configuration for the star animation, including direction and speed.
 * @param {HTMLDivElement[]} containers - The container where the stars will be animated.
 * @returns {void} This function has no output.
 */
const setupStars = ({ direction = 'up', speed = 50 }: StarsConfig, containers: HTMLDivElement[]): void => {
    const originalPositions = [0, 100];
    const initialPositions = direction === 'up' ? originalPositions : originalPositions.reverse();
    containers.forEach((star, index) => (star.style.top = `${initialPositions[index]}%`));

    animateStars(containers, direction, speed);
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

            target[key] = <StarsConfig[Extract<keyof StarsConfig, string>]>(
                (isObject(targetValue) && isObject(sourceValue) ? deepMergeConfig(targetValue, sourceValue) : sourceValue)
            );
        }
    }

    return target;
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

    const scrollContainer = document.querySelector<HTMLDivElement>(mergedConfig.container);
    if (!scrollContainer) return;

    Array.from({ length: 2 }).forEach((_, index) => {
        const starContainer = document.createElement('div');
        starContainer.id = `star_container${index + 1}`;
        starContainer.style.top = index === 0 ? '0' : '100%';

        Object.entries(<Record<string, StarConfig>>mergedConfig.stars).forEach(([size, { count, blinkDuration }]) => {
            Array.from({ length: count }).forEach(() => {
                const star = document.createElement('div');
                star.className = `stars ${size}`;

                Object.assign(star.style, {
                    animation: `blink ${blinkDuration}s infinite`,
                    top: `${Math.random() * 100}vh`,
                    left: `${Math.random() * 100}vw`,
                    animationDelay: `${Math.random() * 2}s`
                });

                starContainer.appendChild(star);
            });
        });

        scrollContainer.appendChild(starContainer);
    });

    const starsContainers = <HTMLDivElement[]>(
        Array.from(
            scrollContainer.querySelectorAll<HTMLDivElement>(
                Array.from({ length: 2 }, (_, index) => `#star_container${index + 1}`).join(', ')
            )
        )
    );

    setupStars(mergedConfig, starsContainers);
};

export { initializeStars };
