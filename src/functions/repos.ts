import type { RepoList } from '@root/types';

/**
 * Initializes the repository grid by rendering repository cards based on the provided list of repositories.
 *
 * @param {RepoList} list - The list of repositories to display.
 * @returns {void} This function has no output.
 */
const initializeRepos = (list: RepoList): void => {
    const reposContainer = document.querySelector<HTMLDivElement>('#repo_grid');
    if (!reposContainer) return;

    list.forEach((repo) => {
        const { name, npm } = repo;

        reposContainer.innerHTML += `<div class="flex items-center justify-between gap-4 px-4 py-2 border border-stone-800 bg-stone-900">
            <span class="text-base">${name}</span>
            <div class="flex flex-row gap-4 items-center justify-center">
                <a href="https://github.com/m00nbyte/${name}" target="_blank" title="Open Github Repo"><span class="icon-[devicon--github] invert text-xl mt-1.5"></span></a>
                ${
                    npm
                        ? `<a href="https://npmjs.com/package/@m00nbyte/${name}" target="_blank" title="Open NPM Package"><span class="icon-[devicon--npm] text-xl mt-1.5"></span></a>`
                        : ''
                }
                ${
                    repo.link
                        ? `<a href="${repo.link.url}" target="_blank" title="${repo.link.title}"><span class="${
                              repo.link.url.includes('webstore') ? 'icon-[devicon--chrome]' : 'icon-[mdi--globe]'
                          } text-xl mt-1.5"></span></a>`
                        : ''
                }
            </div>
        </div>`;
    });
};

export { initializeRepos };
