import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((r) => {
        if (r.ok) window.location.href = '/dashboard';
      })
      .catch(() => {});
  }, []);

  return (
    <div className="container page login-page">
      <div className="card login-card">
        <h1>Belépés</h1>
        <p>Jelentkezz be GitHub fiókoddal a OpenSchool használatához.</p>
        <a href="/api/auth/login" className="btn btn-primary github-btn">
          Belépés GitHub-bal
        </a>
      </div>
    </div>
  );
}
