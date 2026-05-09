import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function formatDate(value) {
  if (!value) return 'N/A';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '' });

  const loadNotes = async () => {
    try {
      setError('');
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/notes`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim()
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || 'Failed to create note');
      }

      setForm({ title: '', description: '' });
      await loadNotes();
    } catch (submitError) {
      setError(submitError.message || 'Unable to save note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noteId) => {
    const shouldDelete = window.confirm('Delete this note?');
    if (!shouldDelete) return;

    try {
      setError('');
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      await loadNotes();
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete note');
    }
  };

  return (
    <main className="app-shell">
      <section className="page-header">
        <div>
          <p className="eyebrow">Employee Notes Dashboard</p>
          <h1>Employee Notes</h1>
          <p className="hero-copy">Add daily notes and view them as simple cards.</p>
        </div>

        <button type="button" className="secondary-button" onClick={loadNotes}>
          Refresh Notes
        </button>
      </section>

      <section className="layout">
        <form className="note-form" onSubmit={handleSubmit}>
          <h2>Add Note</h2>

          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Completed React Practice"
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Learned useEffect and API integration"
              rows="4"
            />
          </label>

          {error ? <p className="error-message">{error}</p> : null}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Note'}
          </button>
        </form>

        <section className="content">
          {loading ? <p className="status-text">Loading notes...</p> : null}

          {!loading && notes.length === 0 ? (
            <div className="empty-state">
              <h3>No notes yet</h3>
              <p>Create the first note using the form.</p>
            </div>
          ) : null}

          <div className="notes-grid">
            {notes.map((note) => (
              <article className="note-card" key={note._id}>
                <h3>{note.title}</h3>
                <p>{note.description}</p>

                <div className="note-card__footer">
                  <span>Created At: {formatDate(note.createdAt)}</span>
                  <button type="button" onClick={() => handleDelete(note._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
