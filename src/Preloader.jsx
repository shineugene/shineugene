import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef();
  const leftRef = useRef();
  const centerRef = useRef();
  const rightRef = useRef();

  // Keep a stable reference to the onComplete callback to avoid triggering useEffect runs
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state values via GSAP to ensure precision and sync with inline styles
      gsap.set(preloaderRef.current, {
        backgroundColor: '#000000',
        autoAlpha: 1
      });
      gsap.set(centerRef.current, {
        autoAlpha: 0,
        y: 10 // Pushed slightly down initially
      });
      gsap.set(leftRef.current, {
        autoAlpha: 0,
        x: 30, // Pushed right (closer to center slash) initially
        clipPath: 'inset(0 100% 0 35%)',
        filter: 'invert(1) blur(5px)'
      });
      gsap.set(rightRef.current, {
        autoAlpha: 0,
        x: -30, // Pushed left (closer to center slash) initially
        clipPath: 'inset(0 56% 0 100%)',
        filter: 'invert(1) blur(5px)'
      });

      const tl = gsap.timeline({
        onComplete: () => {
          if (onCompleteRef.current) onCompleteRef.current();
        }
      });

      // --- Phase 1: 슬래시(/) 등장 (0초) ---
      // Fades in and slides up to its final y: 0 position
      tl.to(centerRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: 'expo.out'
      }, 0);

      // --- Phase 2: 좌측 'found' 등장 (0.5초) ---
      // Slides out from the central slash boundary (x: 30 -> 0)
      // Simultaneously opens clipPath from center out to the left and unblurs
      tl.to(leftRef.current, {
        autoAlpha: 1,
        x: 0,
        clipPath: 'inset(0 65% 0 0%)',
        filter: 'invert(1) blur(0px)',
        duration: 1.2,
        ease: 'expo.out'
      }, 0.5);

      // --- Phase 3: 우측 'Founded' 등장 (0.8초) ---
      // Slides out from the central slash boundary (x: -30 -> 0)
      // Simultaneously opens clipPath from center out to the right and unblurs
      tl.to(rightRef.current, {
        autoAlpha: 1,
        x: 0,
        clipPath: 'inset(0 0% 0 44%)',
        filter: 'invert(1) blur(0px)',
        duration: 1.2,
        ease: 'expo.out'
      }, 0.8);

      // --- Phase 4: 화면 입장 (2.4초) ---
      // The fully completed logo is formed at 2.0s (0.8s + 1.2s).
      // Linger for 0.4s (reduced from 0.8s) to build anticipation (2.0s -> 2.4s).
      // Then fade out the preloader overlay over 0.5s (reduced from 1.0s).
      tl.to(preloaderRef.current, {
        autoAlpha: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      }, 2.4);

    }, preloaderRef);

    return () => ctx.revert();
  }, []); // Empty dependency array to guarantee single execution

  return (
    <div 
      id="preloader"
      ref={preloaderRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        willChange: 'transform, opacity'
      }}
    >
      {/* 3-layer logo wrapper */}
      <div
        style={{
          position: 'relative',
          width: '900px', // Enlarged by 50% (from 600px)
          height: '90px',  // Enlarged by 50% (from 60px)
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >
        {/* Left Layer: found */}
        <img 
          ref={leftRef}
          src="/logo-center.svg"
          alt="found text layer"
          style={{
            position: 'absolute',
            width: '900px',
            height: 'auto',
            left: 0,
            top: 0,
            filter: 'invert(1) blur(5px)', // Initial blur for FOUC protection
            clipPath: 'inset(0 100% 0 35%)', // Initial mask state
            opacity: 0,
            visibility: 'hidden',
            willChange: 'transform, opacity, clip-path, filter'
          }}
        />

        {/* Center Layer: slash (/) */}
        <img 
          ref={centerRef}
          src="/logo-center.svg"
          alt="slash layer"
          style={{
            position: 'absolute',
            width: '900px',
            height: 'auto',
            left: 0,
            top: 0,
            filter: 'invert(1)',
            clipPath: 'inset(0 56% 0 35%)',
            opacity: 0,
            visibility: 'hidden',
            willChange: 'transform, opacity'
          }}
        />

        {/* Right Layer: Founded */}
        <img 
          ref={rightRef}
          src="/logo-center.svg"
          alt="founded text layer"
          style={{
            position: 'absolute',
            width: '900px',
            height: 'auto',
            left: 0,
            top: 0,
            filter: 'invert(1) blur(5px)', // Initial blur for FOUC protection
            clipPath: 'inset(0 56% 0 100%)', // Initial mask state
            opacity: 0,
            visibility: 'hidden',
            willChange: 'transform, opacity, clip-path, filter'
          }}
        />
      </div>
    </div>
  );
}
