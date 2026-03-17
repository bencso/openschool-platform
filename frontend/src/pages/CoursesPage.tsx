import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CourseListItem } from '../lib/types';

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses')
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((body) => setCourses(body.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page">
      <h1>Elérhető kurzusok</h1>
      <div className="card-grid">
        {loading ? (
          <p>Betöltés...</p>
        ) : courses.length === 0 ? (
          <p>Még nincsenek kurzusok.</p>
        ) : (
          courses.map((c) => (
            <div className="card" key={c.id}>
              <h3>{c.name}</h3>
              <p>{c.description || ''}</p>
              <Link to={`/courses/${c.id}`} className="btn btn-secondary" style={{ marginTop: 12 }}>
                Részletek
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
