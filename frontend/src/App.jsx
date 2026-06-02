import { useCallback, useEffect, useState } from 'react';
import {
  analyzeProfile,
  checkHealth,
  getAllProfiles,
  getProfileByUsername,
} from './api';
import AnalyzeForm from './components/AnalyzeForm';
import ProfileCard from './components/ProfileCard';
import ProfileList from './components/ProfileList';

export default function App() {
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiOnline, setApiOnline] = useState(null);

  const loadProfiles = useCallback(async () => {
    setListLoading(true);
    setError('');
    try {
      const { data } = await getAllProfiles();
      setProfiles(data || []);
    } catch (err) {
      setError(err.message);
      setProfiles([]);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
    loadProfiles();
  }, [loadProfiles]);

  async function handleAnalyze(username) {
    setLoading(true);
    setError('');
    try {
      const { data } = await analyzeProfile(username);
      setSelected(data);
      await loadProfiles();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(username) {
    setLoading(true);
    setError('');
    try {
      const { data } = await getProfileByUsername(username);
      setSelected(data);
    } catch (err) {
      setError(err.message);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <span className="header__logo" aria-hidden="true">
            ◈
          </span>
          <div>
            <h1>GitHub Profile Analyzer</h1>
            <p className="header__tagline">
              Analyze public profiles and browse saved insights
            </p>
          </div>
        </div>
        <span
          className={`status-pill ${apiOnline === true ? 'status-pill--ok' : apiOnline === false ? 'status-pill--err' : ''}`}
        >
          {apiOnline === null && 'Checking API…'}
          {apiOnline === true && 'API online'}
          {apiOnline === false && 'API offline'}
        </span>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <AnalyzeForm onAnalyze={handleAnalyze} loading={loading} />
          <ProfileList
            profiles={profiles}
            loading={listLoading}
            selectedUsername={selected?.username}
            onSelect={handleSelect}
          />
        </aside>

        <section className="main-panel">
          {error && (
            <div className="alert" role="alert">
              {error}
            </div>
          )}

          {loading && !selected && (
            <div className="empty-state">
              <div className="spinner" />
              <p>Loading profile…</p>
            </div>
          )}

          {!loading && !selected && !error && (
            <div className="empty-state">
              <p className="empty-state__title">No profile selected</p>
              <p>
                Enter a GitHub username to analyze, or pick one from the list.
              </p>
            </div>
          )}

          {selected && <ProfileCard profile={selected} />}
        </section>
      </main>
    </div>
  );
}
