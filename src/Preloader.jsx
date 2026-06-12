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
      // Set initial state values via GSAP to ensure precision
      gsap.set(preloaderRef.current, {
        backgroundColor: '#000000',
        y: '0%'
      });
      gsap.set(centerRef.current, {
        opacity: 0,
        y: 15 // Pushed slightly down initially
      });
      gsap.set(leftRef.current, {
        opacity: 0,
        x: -25 // Pushed slightly to the left initially
      });
      gsap.set(rightRef.current, {
        opacity: 0,
        x: 25 // Pushed slightly to the right initially
      });

      const tl = gsap.timeline({
        onComplete: () => {
          if (onCompleteRef.current) onCompleteRef.current();
        }
      });

      // --- Phase 1: 슬래시(/) 등장 (0초 지점) ---
      tl.to(centerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, 0);

      // --- Phase 2: 좌측 'found' 등장 (0.4초 지점) ---
      // Slides from left to right (x: -25 -> 0) to align with center slash
      tl.to(leftRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, 0.4);

      // --- Phase 3: 우측 'Founded' 등장 (0.8초 지점) ---
      // Slides from right to left (x: 25 -> 0) to align with center slash
      tl.to(rightRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, 0.8);

      // --- Phase 4: 화면 입장 (2.0초 지점) ---
      // Hold for 0.4s (from 1.6s when Phase 3 ends to 2.0s) then swipe up
      tl.to(preloaderRef.current, {
        y: '-100%',
        duration: 0.8,
        ease: 'power3.inOut'
      }, 2.0);

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
        willChange: 'transform'
      }}
    >
      {/* 3-layer logo wrapper */}
      <div
        style={{
          position: 'relative',
          width: '600px', // Enlarged by 50% (from 400px)
          height: '60px',
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
            width: '600px',
            height: 'auto',
            left: 0,
            top: 0,
            filter: 'invert(1)', // White logo on black background
            clipPath: 'inset(0 65% 0 0%)',
            willChange: 'transform, opacity'
          }}
        />

        {/* Center Layer: slash (/) */}
        <img 
          ref={centerRef}
          src="/logo-center.svg"
          alt="slash layer"
          style={{
            position: 'absolute',
            width: '600px',
            height: 'auto',
            left: 0,
            top: 0,
            filter: 'invert(1)',
            clipPath: 'inset(0 56% 0 35%)',
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
            width: '600px',
            height: 'auto',
            left: 0,
            top: 0,
            filter: 'invert(1)',
            clipPath: 'inset(0 0% 0 44%)',
            willChange: 'transform, opacity'
          }}
        />
      </div>
    </div>
  );
}
