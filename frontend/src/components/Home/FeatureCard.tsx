import React from 'react';

type Props = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  count?: React.ReactNode;
  link?: string | null;
};

const FeatureCard: React.FC<Props> = ({ icon, title, desc, count, link }) => {
  return (
    <article className="feature-card">
      <div className="card-icon">{icon}</div>
      <h2>{title}</h2>
      <p className="card-desc">{desc}</p>
      <div className="card-footer">
        <span className="card-count">{count ?? '—'}</span>
        {link ? (
          <a href={link} className="card-link">Acessar →</a>
        ) : (
          <button className="card-link" aria-disabled> Acessar → </button>
        )}
      </div>
    </article>
  );
};

export default FeatureCard;
