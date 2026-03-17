import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { VerifyResponse } from '../lib/types';

export default function VerifyPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(`/api/verify/${id}`);
        if (res.status === 404) {
          setNotFound(true);
        } else if (res.ok) {
          setData(await res.json());
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [id]);

  if (loading) {
    return (
      <div className="container page verify-page">
        <div className="card verify-card">
          <p>Ellenőrzés...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container page verify-page">
        <div className="card verify-card">
          <h1 style={{ color: 'var(--color-accent)' }}>Érvénytelen tanúsítvány</h1>
          <p>Ez a tanúsítvány azonosító nem található a rendszerben.</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container page verify-page">
        <div className="card verify-card">
          <p>Hiba történt az ellenőrzés során.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container page verify-page">
      <div className="card verify-card">
        <div className="valid-badge">&#10003; Érvényes</div>
        <h1>OpenSchool Tanúsítvány</h1>
        <div className="verify-details">
          <p>
            <strong>Név:</strong> {data.name}
          </p>
          <p>
            <strong>Kurzus:</strong> {data.course}
          </p>
          <p>
            <strong>Kiállítva:</strong> {new Date(data.issued_at).toLocaleDateString('hu-HU')}
          </p>
          <p>
            <strong>Azonosító:</strong> {data.cert_id}
          </p>
        </div>
      </div>
    </div>
  );
}
