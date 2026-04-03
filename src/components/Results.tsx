import React from 'react';

const Results = ({ response }) => {
  if (!response) return null;

  const getVerificationBadge = (score) => {
    if (score >= 0.9) return <span className="badge green">✅ Verified</span>;
    if (score >= 0.5) return <span className="badge yellow">🟡 Partial Match</span>;
    return <span className="badge red">🔴 Unverified</span>;
  };

  return (
    <div className="results-container">
      <h2>Response</h2>
      <p>{response.answer}</p>
      <h3>Citations</h3>
      <div className="citations-grid">
        {response.citations.map((citation, index) => (
          <div key={index} className="citation-card">
            <h4>{citation.case_name}</h4>
            <p>{citation.canonical}</p>
            <p>{citation.court}, {citation.date}</p>
            <div className="verification-details">
              {getVerificationBadge(citation.verification.score)}
              <div className="confidence-bar">
                <div 
                  className="confidence-level" 
                  style={{ width: `${citation.verification.score * 100}%` }}
                ></div>
              </div>
              <span>{Math.round(citation.verification.score * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
