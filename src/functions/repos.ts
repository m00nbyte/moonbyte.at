import type { GitHubRepoList } from '@root/types';

/**
 * Returns a color associated with a programming language for visual distinction.
 *
 * @param {string} language - The programming language to get a color for.
 * @returns {string} A hexadecimal color code for the language.
 */
const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
        TypeScript: 'bg-sky-600',
        JavaScript: 'bg-yellow-400',
        HTML: 'bg-red-600'
    };
    return colors[language] || 'bg-stone-300';
};

/**
 * Fetches repositories from GitHub's public API for the specified user.
 *
 * @async
 * @param {string} username - The GitHub username to fetch repositories for.
 * @param {number} [count=100] - The maximum number of repositories to fetch (default: 100).
 * @returns {Promise<GitHubRepoList>} A promise that resolves to an array of GitHub repositories.
 * @throws {Error} When the API request fails.
 */
const fetchGitHubRepos = async (username: string, count: number = 100): Promise<GitHubRepoList> => {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${count}`);

        if (!response.ok) throw new Error('Failed to fetch GitHub repos');

        return await response.json();
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        return [];
    }
};

/**
 * Renders GitHub repositories as interactive cards in the DOM.
 *
 * @param {GitHubRepoList} repos - An array of GitHub repositories to render.
 * @returns {void} This function has no output.
 */
const renderGitHubRepos = (repos: GitHubRepoList): void => {
    const reposContainer = document.querySelector<HTMLDivElement>('#repo_grid');
    const loadingIndicator = document.querySelector<HTMLDivElement>('#loading_indicator');

    if (!reposContainer || !loadingIndicator) return;

    loadingIndicator.remove();

    for (const repo of repos) {
        reposContainer.innerHTML += `
        <div class="group relative h-full overflow-hidden border border-stone-700 bg-stone-700 p-3 transition-all">
            <div class="flex flex-col gap-2 h-full">
                <div class="flex items-center justify-between">
                    <div class="flex flex-col gap-1">
                        <h4 class="text-lg font-bold">${repo.name}</h4>
                        ${
                            repo.language
                                ? `
                                    <div class="flex items-center gap-2 text-xs mt-auto">
                                        <span class="h-3 w-3 rounded-full ${getLanguageColor(repo.language)}"></span>
                                        <span class="text-stone-100">${repo.language}</span>
                                    </div>
                                `
                                : ''
                        }
                    </div>
                    <div class="flex items-center gap-1">
                        ${
                            repo.stargazers_count > 0
                                ? `
                                    <span class="flex items-center gap-1 text-lg text-stone-100 w-8 h-8">
                                        <span class="icon-[mdi--star] text-yellow-400"></span>
                                        <span>${repo.stargazers_count}</span>
                                    </span>
                                `
                                : ''
                        }
                        <a href="${repo.html_url}"
                           target="_blank"
                           title="View on GitHub"
                           class="flex h-8 w-8 items-center justify-center">
                            <span class="icon-[devicon--github] invert text-lg"></span>
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
    }
};

/**
 * Initializes the GitHub repository display by fetching, filtering, and rendering repositories.
 *
 * @async
 * @param {string} username - The GitHub username whose repositories should be displayed.
 * @param {string[]} allowedRepos - Configuration for allowed repositories and their additional links.
 * @returns {Promise<void>} A promise that resolves when initialization is complete.
 */
const initializeRepos = async (username: string, allowedRepos: string[]): Promise<void> => {
    const repos = await fetchGitHubRepos(username);
    const filteredRepos = repos.filter((repo) => allowedRepos.includes(repo.name));
    renderGitHubRepos(filteredRepos);
};

export { initializeRepos };
