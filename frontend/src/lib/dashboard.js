function getToken() {
  return localStorage.getItem('access_token');
}

function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  return { Authorization: `Bearer ${token}` };
}

async function loadDashboard() {
  const container = document.getElementById('dashboard-content');
  if (!container) return;

  const headers = requireAuth();
  if (!headers) return;

  try {
    const [dashRes, certRes] = await Promise.all([
      fetch('/api/me/dashboard', { headers }),
      fetch('/api/me/certificates', { headers }),
    ]);

    if (dashRes.status === 401 || dashRes.status === 403) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      return;
    }

    const courses = await dashRes.json();
    const certs = certRes.ok ? await certRes.json() : [];

    if (courses.length === 0) {
      container.innerHTML = `
        <p>Még nem iratkoztál be semmilyen kurzusra.</p>
        <a href="/courses" class="btn btn-primary" style="margin-top:16px;">Kurzusok böngészése</a>
      `;
      return;
    }

    const certMap = {};
    certs.forEach((c) => { certMap[c.course_id] = c; });

    container.innerHTML = courses.map((c) => {
      const cert = certMap[c.course_id];
      const isComplete = c.progress_percent >= 100;

      let certHtml = '';
      if (cert) {
        certHtml = `<button class="btn btn-secondary download-cert" data-cert-id="${cert.cert_id}" style="margin-top:8px;">PDF letöltése</button>`;
      } else if (isComplete) {
        certHtml = `<button class="btn btn-primary request-cert" data-course-id="${c.course_id}" style="margin-top:8px;">Tanúsítvány igénylése</button>`;
      }

      return `
        <div class="card" style="margin-bottom:16px;">
          <h3>${c.course_name}</h3>
          <div class="progress-wrapper">
            <div class="progress-bar">
              <div class="progress-bar-fill" style="width:${c.progress_percent}%;"></div>
            </div>
            <span style="font-weight:600;margin-left:12px;">${c.completed_exercises}/${c.total_exercises} — ${c.progress_percent}%</span>
          </div>
          ${certHtml}
        </div>
      `;
    }).join('');

    document.querySelectorAll('.download-cert').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const certId = e.target.dataset.certId;
        const r = await fetch(`/api/me/certificates/${certId}/pdf`, { headers });
        if (r.ok) {
          const blob = await r.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `certificate-${certId}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        } else {
          alert('Nem sikerült letölteni a PDF-et.');
        }
      });
    });

    document.querySelectorAll('.request-cert').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const courseId = e.target.dataset.courseId;
        const r = await fetch(`/api/me/courses/${courseId}/certificate`, {
          method: 'POST',
          headers,
        });
        if (r.status === 201) {
          window.location.reload();
        } else {
          const d = await r.json();
          alert(d.detail || 'Hiba történt.');
        }
      });
    });
  } catch {
    container.innerHTML = '<p>Hiba történt a betöltés során.</p>';
  }
}

function initSyncButton() {
  document.getElementById('sync-btn')?.addEventListener('click', async () => {
    const headers = requireAuth();
    if (!headers) return;

    const btn = document.getElementById('sync-btn');
    const msg = document.getElementById('sync-msg');
    if (btn) btn.disabled = true;
    if (btn) btn.textContent = '⏳ Szinkronizálás...';
    try {
      const r = await fetch('/api/me/sync-progress', {
        method: 'POST',
        headers,
      });
      if (r.ok) {
        if (msg) msg.innerHTML = '<p style="color:green;">Haladás frissítve!</p>';
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const d = await r.json();
        if (msg) msg.innerHTML = `<p style="color:red;">${d.detail || 'Hiba történt.'}</p>`;
      }
    } catch {
      if (msg) msg.innerHTML = '<p style="color:red;">Hiba történt a szinkronizálás során.</p>';
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '🔄 Haladás szinkronizálása GitHub-ból'; }
    }
  });
}

loadDashboard();
initSyncButton();
