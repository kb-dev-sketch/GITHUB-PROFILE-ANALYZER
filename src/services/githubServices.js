const axios=require("axios");

const githubClient=axios.create({
    baseURL:"https://api.github.com",
    headers:{
        "Accept":"application/vnd.github.v3+json",
        "User-Agent":"Github-Profile-Analyzer-App",
        ...(process.env.GITHUB_TOKEN
            ?{
                Authorization:`Bearer ${process.env.GITHUB_TOKEN}`
            } : {})
        
    },
    timeout:10000
});

async function fetchGithubProfile(username) {
  try {
    const response = await githubClient.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    handleGithubError(error);
  }
}
function handleGithubError(error) {
  if (error.response?.status === 404) {
    const notFoundError = new Error('GitHub user not found');
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  if (error.response?.status === 403) {
    const rateLimitError = new Error(
      'GitHub API rate limit exceeded. Add GITHUB_TOKEN to .env or try again later.'
    );
    rateLimitError.statusCode = 403;
    throw rateLimitError;
  }

  throw error;
}

async function fetchUserRepositories(username) {
  const repos = [];
  let page = 1;
  const perPage = 100;

  try {
    while (page <= 3) {
      const response = await githubClient.get(`/users/${username}/repos`, {
        params: {
          per_page: perPage,
          page,
          sort: 'updated',
          direction: 'desc',
        },
      });
      repos.push(...response.data);
      if (response.data.length < perPage) {
        break;
      }
      page++;
    }
    return repos;
  } catch (error) {
    handleGithubError(error);
  }
}
module.exports = {
  fetchGithubProfile,
  fetchUserRepositories
};
