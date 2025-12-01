import React from 'react';

type Props = { title?: string };

const HeaderHome: React.FC<Props> = ({ title = 'Home' }) => (
  <div className="page-header">
    <h1 className="page-title">{title}</h1>
  </div>
);

export default HeaderHome;
