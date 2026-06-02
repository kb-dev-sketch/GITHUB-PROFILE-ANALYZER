import { useState } from 'react';

export default function AnalyzeForm({ onAnalyze, loading }) {
  const [username, setUsername] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    onAnalyze(trimmed);
  }

  return (
    <form className="analyze-form" onSubmit={handleSubmit}>
      <label htmlFor="username">GitHub username</label>
      <div className="analyze-form__row">
        <input
          id="username"
          type="text"
          placeholder="octocat"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !username.trim()}>
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </div>
    </form>
  );
}
