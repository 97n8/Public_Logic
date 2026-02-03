/* ==========================================================================
   WORKBENCH — Mobile-first, desktop-friendly, calm & spacious
   ========================================================================== */

.workbench {
  min-height: 100vh;
  padding: 16px 16px 100px;           /* mobile default */
  max-width: 1280px;
  margin: 0 auto;
  background: var(--bg0);
  color: var(--ink);
  font-family: var(--font-sans);
}

@media (min-width: 768px) {
  .workbench {
    padding: 32px 40px 120px;         /* more breathing room on desktop */
  }
}

/* Header */
.header {
  padding-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #34d399 0%, #1e8c6a 100%);
  color: white;
  font-weight: 900;
  font-size: 1.6rem;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 12px rgba(52, 211, 153, 0.35);
}

.brand-name {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.date {
  font-size: 0.9rem;
  color: var(--muted);
  margin-top: 4px;
}

/* Floating Action Button */
.fab {
  position: fixed;
  z-index: 100;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: 700;
  box-shadow: 0 10px 40px rgba(52, 211, 153, 0.5);
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Mobile positioning */
@media (max-width: 767px) {
  .fab {
    bottom: 28px;
    right: 24px;
  }
}

/* Desktop positioning – top-right corner */
@media (min-width: 768px) {
  .fab {
    top: 32px;
    right: 40px;
    width: 68px;
    height: 68px;
    font-size: 0.95rem;
  }

  .fab:hover {
    transform: scale(1.12);
    box-shadow: 0 14px 48px rgba(52, 211, 153, 0.6);
  }
}

.fab-icon {
  font-size: 1.8rem;
}

.fab-label {
  font-size: 0.82rem;
}

/* Main content */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(247, 245, 239, 0.08);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(12px);
  transition: all 0.28s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.35);
}

.card-title {
  font-family: var(--font-serif);
  font-size: 1.45rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.card-subtitle {
  font-size: 1rem;
  color: var(--muted);
  line-height: 1.5;
}

.card--calm {
  text-align: center;
  padding: 40px 24px;
  background: rgba(0, 0, 0, 0.14);
  border-color: transparent;
}

/* Recent list */
.recent-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
}

.recent-item {
  padding: 14px 0;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.recent-item:first-child {
  border-top: none;
}

.file-link {
  color: var(--ink);
  font-weight: 500;
  transition: color 0.2s ease;
}

.file-link:hover {
  color: var(--accent);
}

.time {
  font-size: 0.88rem;
  color: var(--muted);
  white-space: nowrap;
}

/* Secondary tiny links */
.secondary-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
  justify-content: center;
}

.pill {
  padding: 10px 16px;
  background: rgba(52, 211, 153, 0.08);
  border-radius: 999px;
  color: var(--accent);
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.pill:hover {
  background: rgba(52, 211, 153, 0.16);
}

/* Desktop-specific layout tweaks */
@media (min-width: 768px) {
  .main-content {
    max-width: 960px;
    padding: 0 40px;
  }

  .card {
    padding: 32px 36px;
  }

  .card-title {
    font-size: 1.65rem;
  }
}
