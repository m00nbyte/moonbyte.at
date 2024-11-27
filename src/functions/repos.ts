import type { RepoList, RepoLinkConfig } from '@root/types';

/**
 * Initializes the repository grid by rendering repository cards based on the provided list of repositories.
 *
 * @param {RepoList} list - The list of repositories to display.
 * @returns {void} This function has no output.
 */
const initializeRepos = (list: RepoList): void => {
    const reposContainer = document.querySelector<HTMLDivElement>('#repo_grid');
    if (!reposContainer) return;

    const linkMap: RepoLinkConfig = {
        gh: {
            title: 'Open Github Repo',
            icon: 'icon-[devicon--github] invert',
            link: 'https://github.com/m00nbyte'
        },
        npm: {
            title: 'Open NPM Package',
            icon: 'icon-[devicon--npm]',
            link: 'https://npmjs.com/package/@m00nbyte'
        },
        web: {
            title: 'Visit Website',
            icon: 'icon-[mdi--globe]'
        },
        cws: {
            title: 'Open Web Store',
            icon: 'icon-[devicon--chrome]'
        }
    };

    for (const { name, type, url } of list) {
        const mappedConfig = linkMap[type];
        if (!mappedConfig) return;

        const { title, icon, link } = mappedConfig;

        reposContainer.innerHTML += `<div class="flex items-center justify-between gap-4 px-4 py-2 border border-stone-800 bg-stone-900">
            <span class="text-base">${name}</span>
            <div class="flex flex-row gap-4 items-center justify-center">
                <a href="${
                    url || (link && `${link}/${name}`) || '#'
                }" target="_blank" title="${title}"><span class="${icon} text-xl mt-1.5"></span></a>
            </div>
        </div>`;
    }
};

export { initializeRepos };
