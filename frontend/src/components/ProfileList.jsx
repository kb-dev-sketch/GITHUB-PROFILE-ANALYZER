function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProfileList({
  profiles,
  loading,
  selectedUsername,
  onSelect,
}) {
  return (
    <div className="profile-list">
      <h2>Saved profiles</h2>

      {loading && <p className="profile-list__hint">Loading…</p>}

      {!loading && profiles.length === 0 && (
        <p className="profile-list__hint">No profiles analyzed yet.</p>
      )}

      <ul>
        {profiles.map((profile) => (
          <li key={profile.id ?? profile.username}>
            <button
              type="button"
              className={`profile-list__item ${selectedUsername === profile.username ? 'profile-list__item--active' : ''}`}
              onClick={() => onSelect(profile.username)}
            >
              <img src={profile.avatar_url} alt="" width={36} height={36} />
              <span className="profile-list__meta">
                <strong>@{profile.username}</strong>
                <small>{formatDate(profile.last_analyzed_at)}</small>
              </span>
              <span className="profile-list__stars" title="Total stars">
                ★ {profile.total_stars ?? 0}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
