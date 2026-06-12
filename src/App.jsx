import React, { useState, useEffect, useRef } from 'react';
import Scene3D from './Scene3D';
import DetailPage from './DetailPage';
import './App.css';

export default function App() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isCircleReady, setIsCircleReady] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [currentView, setCurrentView] = useState('gallery');
  const [activeDetailIndex, setActiveDetailIndex] = useState(null);

  // Transition buffer states
  const [cachedDetailIndex, setCachedDetailIndex] = useState(null);
  const [shouldRenderDetail, setShouldRenderDetail] = useState(false);
  const detailTimeoutRef = useRef(null);

  // Sync selectedCardIndex to a ref to avoid dependencies in the hash routing listener
  const selectedCardIndexRef = useRef(selectedCardIndex);
  useEffect(() => {
    selectedCardIndexRef.current = selectedCardIndex;
  }, [selectedCardIndex]);

  // Hash-based router setup
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      // Clear any pending unmount timeout
      if (detailTimeoutRef.current) {
        clearTimeout(detailTimeoutRef.current);
        detailTimeoutRef.current = null;
      }

      if (hash.startsWith('#/detail')) {
        const parts = hash.split('/');
        const param = parts.length > 2 ? parts[2] : '';
        
        let targetIndex = null;
        if (param) {
          const match = param.match(/^work-(\d+)$/);
          if (match) {
            targetIndex = parseInt(match[1], 10) - 1;
          } else {
            const indexVal = parseInt(param, 10);
            if (!isNaN(indexVal)) {
              targetIndex = indexVal;
            }
          }
        }
        
        if (targetIndex === null && selectedCardIndexRef.current !== null) {
          targetIndex = selectedCardIndexRef.current;
        }

        if (targetIndex !== null) {
          setActiveDetailIndex(targetIndex);
          setSelectedCardIndex(targetIndex);
          setCachedDetailIndex(targetIndex);
        }

        setCurrentView('detail');
        setShouldRenderDetail(true);
      } else {
        setCurrentView('gallery');
        setSelectedCardIndex(null); // Smoothly slide card back when returning to gallery
        setActiveDetailIndex(null);
        
        // Wait for the fade-out animation (0.8s) before unmounting DetailPage
        detailTimeoutRef.current = setTimeout(() => {
          setShouldRenderDetail(false);
        }, 800);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      if (detailTimeoutRef.current) {
        clearTimeout(detailTimeoutRef.current);
      }
    };
  }, []);

  const handleBackgroundClick = () => {
    if (currentView === 'detail') return; // Disable canvas clicks in detail view
    
    if (selectedCardIndex !== null) {
      setSelectedCardIndex(null);
    } else {
      const nextClicked = !isClicked;
      setIsClicked(nextClicked);
      if (!nextClicked) {
        setSelectedCardIndex(null);
      }
    }
  };

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        backgroundColor: '#ffffff'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Canvas Background (Keep mounted to preserve ThreeJS state and allow return animations) */}
      <div style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        visibility: currentView === 'detail' ? 'hidden' : 'visible',
        pointerEvents: currentView === 'detail' ? 'none' : 'auto',
        zIndex: 1
      }}>
        <Scene3D 
          isHovered={isHovered} 
          isClicked={isClicked} 
          setIsClicked={setIsClicked}
          isCircleReady={isCircleReady} 
          setIsCircleReady={setIsCircleReady} 
          selectedCardIndex={selectedCardIndex}
          setSelectedCardIndex={setSelectedCardIndex}
          onBackgroundClick={handleBackgroundClick}
        />
      </div>

      {/* Fixed Top Center Navigation Menu (Works, Things, Activity) */}
      {currentView === 'gallery' && selectedCardIndex === null && (
        <div 
          style={{
            position: 'absolute',
            top: '43px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '48px',
            height: '31.68px',
            alignItems: 'center',
            fontFamily: "'Aeonik-SemiBold', sans-serif",
            fontWeight: 600,
            fontSize: '25px',
            letterSpacing: '-0.03em',
            color: '#1d1d1d',
            zIndex: 10,
            pointerEvents: 'auto',
            userSelect: 'none'
          }}
        >
          <span style={{ cursor: 'pointer' }}>About</span>
          <span style={{ cursor: 'pointer' }}>Works</span>
          <span style={{ cursor: 'pointer' }}>Contact</span>
        </div>
      )}

      {/* Fixed Center Text Overlay with Fade-in and customized Aeonik font */}
      <div 
        style={{
          position: 'absolute',
          top: 'calc(50% + 5px)',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 5,
          opacity: (isCircleReady && selectedCardIndex === null && currentView === 'gallery') ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none'
        }}
      >
        {/* Existing Title Text */}
        <div 
          style={{
            fontFamily: "'Aeonik', sans-serif",
            fontWeight: 600,
            fontSize: '28px',
            color: '#1d1d1d',
            letterSpacing: '-0.03em',
            whiteSpace: 'nowrap'
          }}
        >
          Discover the value in essence.
        </div>
      </div>

      {/* Extreme Minimalist Overlay: Only Left & Right Logos at the Top Ends */}
      {currentView === 'gallery' && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '40px',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <img 
            src="/logo-left.svg" 
            alt="Logo Left" 
            style={{ 
              height: '31.68px',
              pointerEvents: 'auto' 
            }} 
          />
          <img 
            src="/logo-right.svg" 
            alt="Logo Right" 
            style={{ 
              height: '31.68px',
              pointerEvents: 'auto' 
            }} 
          />
        </div>
      )}

      {/* Detail Page Slide-over overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 20,
        opacity: currentView === 'detail' ? 1 : 0,
        pointerEvents: currentView === 'detail' ? 'auto' : 'none',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: '#e5e4e0'
      }}>
        {shouldRenderDetail && (
          <DetailPage selectedCardIndex={cachedDetailIndex !== null ? cachedDetailIndex : selectedCardIndex} />
        )}
      </div>

      {/* Global Copyright Overlay */}
      <div style={{
        position: 'fixed',
        right: '40px',
        bottom: '40px',
        fontFamily: "'Aeonik Fono', monospace",
        fontSize: '12px',
        color: '#999999',
        letterSpacing: 'normal',
        pointerEvents: 'none',
        zIndex: 100
      }}>
        <span style={{ fontFamily: 'sans-serif' }}>©</span> 2026 foundfounded. All rights reserved.
      </div>
    </div>
  );
}
