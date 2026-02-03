.card--hero {
  background: linear-gradient(145deg, rgba(52, 211, 153, 0.08), rgba(0,0,0,0.2));
  border-color: rgba(52, 211, 153, 0.28);
  padding: 1.5rem 1.75rem;
}

.card__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.card__subtitle {
  font-size: 0.95rem;
  color: var(--muted);
  margin-top: 0.25rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.6em;
  justify-content: center;
  width: 100%;
  text-align: left;
}

.btn--primary {
  font-weight: 700;
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
}

.link-item {
  margin: 0.35rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.6em;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  color: var(--muted);
  text-decoration: none;
  transition: all 0.14s ease;
}

.nav-link:hover {
  background: rgba(52, 211, 153, 0.08);
  color: var(--accent);
}

.icon {
  width: 1.1em;
  text-align: center;
  opacity: 0.75;
}

.external {
  font-size: 0.8em;
  opacity: 0.6;
  margin-left: 0.4em;
}

.status-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.status {
  font-weight: 600;
}

.status--ok {
  color: var(--accent);
}

.status--error {
  color: var(--danger);
}
