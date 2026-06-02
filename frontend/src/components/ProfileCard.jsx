function Stat({ label, value }) {
  return (
    <div className="stat">
      <span className="stat__value">{value ?? '—'}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export default function ProfileCard({ profile }) {
  const displayName = profile.name || profile.username;

  return (
    <article className="profile-card">
      <header className="profile-card__header">
        <img
          className="profile-card__avatar"
          src={profile.avatar_url}
          alt={`${profile.username} avatar`}
          width={96}
          height={96}
        />
        <div>
          <h2>{displayName}</h2>
          <a
            className="profile-card__handle"
            href={profile.profile_url}
            target="_blank"
            rel="noreferrer"
          >
            @{profile.username}
          </a>
          {profile.bio && <p className="profile-card__bio">{profile.bio}</p>}
          <div className="profile-card__meta">
            {profile.company && <span>{profile.company}</span>}
            {profile.location && <span>{profile.location}</span>}
            {profile.blog && (
              <a href={profile.blog} target="_blank" rel="noreferrer">
                Website
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="stats-grid">
        <Stat label="Public repos" value={profile.public_repos} />
        <Stat label="Gists" value={profile.public_gists} />
        <Stat label="Followers" value={profile.followers} />
        <Stat label="Following" value={profile.following} />
        <Stat label="Total stars" value={profile.total_stars} />
        <Stat label="Total forks" value={profile.total_forks} />
        <Stat label="Avg stars / repo" value={profile.average_stars} />
        <Stat label="Top language" value={profile.top_language} />
      </div>

      {profile.most_starred_repo && (
        <div className="highlight">
          <span className="highlight__label">Most starred repo</span>
          <a
            href={profile.most_starred_repo_url}
            target="_blank"
            rel="noreferrer"
          >
            {profile.most_starred_repo}
          </a>
        </div>
      )}

      <footer className="profile-card__footer">
        <span>Account created: {formatDate(profile.account_created_at)}</span>
        <span>Last analyzed: {formatDate(profile.last_analyzed_at)}</span>
      </footer>
    </article>
  );
}
