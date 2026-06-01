 const { pool } = require('../config/database');
const { fetchGithubProfile, fetchUserRepositories } = require('./githubServices');
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
async function saveProfileAnalysis(profile) {
  await pool.query(
    `
    INSERT INTO analyzed_profiles (
        github_id, username, name, avatar_url, profile_url, bio, company, location, blog,
        public_repos, public_gists, followers, following, account_created_at, 
        top_language, total_stars, total_forks, average_stars, most_starred_repo,
        most_starred_repo_url, last_analyzed_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        avatar_url = VALUES(avatar_url),
        profile_url = VALUES(profile_url),
        bio = VALUES(bio),
        company = VALUES(company),
        location = VALUES(location),
        blog = VALUES(blog),
        public_repos = VALUES(public_repos),
        public_gists = VALUES(public_gists),
        followers = VALUES(followers),
        following = VALUES(following),
        account_created_at = VALUES(account_created_at),
        top_language = VALUES(top_language),
        total_stars = VALUES(total_stars),
        total_forks = VALUES(total_forks),
        average_stars = VALUES(average_stars),
        most_starred_repo = VALUES(most_starred_repo),
        most_starred_repo_url = VALUES(most_starred_repo_url),
        last_analyzed_at = NOW()
    `,
    [
      profile.github_id,
      profile.username,
      profile.name,
      profile.avatar_url,
      profile.profile_url,
      profile.bio,
      profile.company,
      profile.location,
      profile.blog,
      profile.public_repos,
      profile.public_gists,
      profile.followers,
      profile.following,
      profile.account_created_at,
      profile.top_language,
      profile.total_stars,
      profile.total_forks,
      profile.average_stars,
      profile.most_starred_repo,
      profile.most_starred_repo_url
    ]
  );

  return getProfileByUsername(profile.username);
}

async function analyzeAndSaveProfile(username) {
  const [githubProfile, repositories] = await Promise.all([
    fetchGithubProfile(username),
    fetchUserRepositories(username)
  ]);

  const insights = buildInsights(githubProfile, repositories);
  return saveProfileAnalysis(insights);
}

async function getAllProfiles() {
  const [rows] = await pool.query(`
    SELECT *
    FROM analyzed_profiles
    ORDER BY last_analyzed_at DESC
  `);

  return rows;
}

async function getProfileByUsername(username) {
  const [rows] = await pool.query(
    `
      SELECT *
      FROM analyzed_profiles
      WHERE username = ?
      LIMIT 1
    `,
    [username]
  );

  return rows[0] || null;
}

module.exports = {
  analyzeAndSaveProfile,
  getAllProfiles,
  getProfileByUsername
};