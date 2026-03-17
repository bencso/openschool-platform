import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../lib/config';
import type { CourseListItem } from '../lib/types';

export default function HomePage() {
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
    <>
      <section className="hero">
        <div className="container">
          <h1>Tanulj programozni, építs projekteket</h1>
          <p className="hero-sub">
            A OpenSchool egy nyílt forráskódú tanulóplatform, ahol valódi projekteken keresztül
            sajátíthatod el a programozást.
          </p>
          <Link to="/courses" className="btn btn-primary">
            Kurzusok böngészése
          </Link>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>Hogyan működik?</h2>
          <div className="steps">
            <div className="step card">
              <div className="step-number">1</div>
              <h3>Beiratkozás</h3>
              <p>Válassz egy kurzust és iratkozz be GitHub fiókoddal. Teljesen ingyenes.</p>
            </div>
            <div className="step card">
              <div className="step-number">2</div>
              <h3>Feladatok</h3>
              <p>
                Dolgozz végig a modulokon. Minden feladatot GitHub-on oldasz meg, a rendszer
                automatikusan ellenőrzi.
              </p>
            </div>
            <div className="step card">
              <div className="step-number">3</div>
              <h3>Tanúsítvány</h3>
              <p>
                Ha minden kötelező feladatot megoldottál, automatikus tanúsítványt kapsz QR kóddal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="quickstart">
        <div className="container">
          <h2>Gyors indulás</h2>
          <p className="quickstart-sub">
            Néhány perc alatt elkezdhetsz tanulni. Nincs bonyolult telepítés, csak egy GitHub fiók
            kell.
          </p>
          <div className="quickstart-steps">
            <div className="qs-step">
              <div className="qs-icon">🔑</div>
              <h3>1. Jelentkezz be</h3>
              <p>
                Kattints a <strong>Belépés</strong> gombra és jelentkezz be a GitHub fiókoddal. Ha
                még nincs,{' '}
                <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer">
                  itt regisztrálhatsz
                </a>{' '}
                ingyen.
              </p>
            </div>
            <div className="qs-step">
              <div className="qs-icon">📚</div>
              <h3>2. Válassz kurzust</h3>
              <p>
                Böngészd az <Link to="/courses">elérhető kurzusokat</Link> és iratkozz be. Kezdőknek
                a <strong>Python Alapok</strong> ajánlott.
              </p>
            </div>
            <div className="qs-step">
              <div className="qs-icon">💻</div>
              <h3>3. Oldd meg a feladatokat</h3>
              <p>
                Minden feladathoz kapsz egy GitHub repót. Klónozd, oldd meg a feladatot, pushold — a
                rendszer automatikusan ellenőrzi.
              </p>
            </div>
            <div className="qs-step">
              <div className="qs-icon">💬</div>
              <h3>4. Kérj segítséget</h3>
              <p>
                Ha elakadtál, csatlakozz a{' '}
                <a href={SITE.discord} target="_blank" rel="noopener noreferrer">
                  Discord szerverünkhöz
                </a>{' '}
                — a közösség és a mentorok segítenek.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="community">
        <div className="container">
          <h2>Közösség &amp; Nyílt forráskód</h2>
          <div className="community-grid">
            <a
              href={SITE.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="community-card card"
            >
              <svg
                className="community-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="#5865F2"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <h3>Discord közösség</h3>
              <p>
                Csatlakozz a Discord szerverünkhöz, ahol segítséget kérhetsz, megismerheted a többi
                tanulót és követheted a fejlesztéseket.
              </p>
            </a>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="community-card card"
            >
              <svg
                className="community-icon"
                width="40"
                height="40"
                viewBox="0 0 16 16"
                fill="var(--color-primary)"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <h3>GitHub repository</h3>
              <p>
                A platform teljes forráskódja elérhető GitHubon. Nézd meg a dokumentációt, nyiss
                issue-t, vagy járulj hozzá a fejlesztéshez.
              </p>
            </a>
            <a
              href={SITE.knowledge}
              target="_blank"
              rel="noopener noreferrer"
              className="community-card card"
            >
              <svg
                className="community-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="var(--color-success)"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  fill="none"
                  stroke="var(--color-success)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3>Tudásbázis</h3>
              <p>
                Kurzusanyagok, leckék, vizsgák és mentori útmutatók. Három kurzus: Python Alapok (13
                hét), Backend FastAPI (25 hét) és Projekt Labor (7 modul).
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="courses-preview">
        <div className="container">
          <h2>Elérhető kurzusok</h2>
          <div className="card-grid">
            {loading ? (
              <p>Kurzusok betöltése...</p>
            ) : courses.length === 0 ? (
              <p>Még nincsenek kurzusok.</p>
            ) : (
              courses.map((c) => (
                <div className="card course-card" key={c.id}>
                  <h3>{c.name}</h3>
                  <p>{c.description || 'Nincs leírás.'}</p>
                  <Link
                    to={`/courses/${c.id}`}
                    className="btn btn-secondary"
                    style={{ marginTop: 12 }}
                  >
                    Részletek
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
