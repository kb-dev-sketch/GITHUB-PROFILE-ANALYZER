 function getTopLanguage(repositories) {
  const counts = {};

  for (let i = 0; i < repositories.length; i++) {
    const lang = repositories[i].language;

    if (lang) {
      if (counts[lang]) {
        counts[lang]++;
      } else {
        counts[lang] = 1;
      }
    }
  }

  let topLanguage = null;
  let maxCount = 0;

  for (const lang in counts) {
    if (counts[lang] > maxCount) {
      maxCount = counts[lang];
      topLanguage = lang;
    }
  }

  return topLanguage;
}

function buildInsights(githubProfile, repositories) {
  let totalStars = 0;
  let totalForks = 0;

  let mostStarredRepo = null;

  for (let i = 0; i < repositories.length; i++) {
    const repo = repositories[i];

    totalStars += repo.stargazers_count;
    totalForks += repo.forks_count;

    if (
      mostStarredRepo === null ||
      repo.stargazers_count > mostStarredRepo.stargazers_count
    ) {
      mostStarredRepo = repo;
    }
  }

  let averageStars = 0;

  if (repositories.length > 0) {
    averageStars = Number(
      (totalStars / repositories.length).toFixed(2)
    );
  }

  return {
    github_id: githubProfile.id,
    username: githubProfile.login,
    name: githubProfile.name,
    avatar_url: githubProfile.avatar_url,
    profile_url: githubProfile.html_url,
    bio: githubProfile.bio,
    company: githubProfile.company,
    location: githubProfile.location,
    blog: githubProfile.blog,

    public_repos: githubProfile.public_repos,
    public_gists: githubProfile.public_gists,
    followers: githubProfile.followers,
    following: githubProfile.following,

    account_created_at: githubProfile.created_at
      ? new Date(githubProfile.created_at)
      : null,

    github_updated_at: githubProfile.updated_at
      ? new Date(githubProfile.updated_at)
      : null,

    top_language: getTopLanguage(repositories),

    total_stars: totalStars,
    total_forks: totalForks,
    average_stars: averageStars,

    most_starred_repo: mostStarredRepo
      ? mostStarredRepo.name
      : null,

    most_starred_repo_url: mostStarredRepo
      ? mostStarredRepo.html_url
      : null
  };
}