import React from 'react';

export default function AboutPage() {
  const handleBackClick = () => {
    window.location.hash = '/';
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#ffffff',
      color: '#1d1d1d',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Aeonik', sans-serif",
      position: 'relative'
    }}>
      {/* Back Button */}
      <div 
        onClick={handleBackClick}
        style={{
          position: 'absolute',
          top: '43px',
          left: '40px',
          fontFamily: "'Aeonik-SemiBold', sans-serif",
          fontWeight: 600,
          fontSize: '20px',
          letterSpacing: '-0.03em',
          cursor: 'pointer',
          userSelect: 'none',
          color: '#1d1d1d'
        }}
      >
        ← Back
      </div>

      <div style={{
        fontSize: '48px',
        fontWeight: 600,
        letterSpacing: '-0.03em',
        marginBottom: '20px'
      }}>
        About us
      </div>

      <p style={{
        fontSize: '20px',
        color: '#666666',
        maxWidth: '500px',
        textAlign: 'center',
        lineHeight: 1.6,
        letterSpacing: '-0.02em',
        margin: '0 20px'
      }}>
        We discover and design the essence of visual forms.
      </p>
    </div>
  );
}
