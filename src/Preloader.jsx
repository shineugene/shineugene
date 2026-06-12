import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef();
  const logoContainerRef = useRef();
  const logoRef = useRef();

  // Keep a stable reference to the onComplete callback to avoid triggering useEffect runs
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Setup initial CSS properties via GSAP to ensure precision
      gsap.set(preloaderRef.current, {
        backgroundColor: '#ffffff'
      });
      gsap.set(logoContainerRef.current, {
        clipPath: 'inset(0 48% 0 48%)'
      });
      gsap.set(logoRef.current, {
        opacity: 1,
        filter: 'invert(0) blur(0px)',
        scale: 1,
        x: 61 // Offset to center the slash (at 39.83% of 600px width) in the 600px container
      });

      const tl = gsap.timeline({
        onComplete: () => {
          // Phase 3: Swipe up preloader container and notify parent to start 3D fade-in
          gsap.to(preloaderRef.current, {
            y: '-100%',
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
              if (onCompleteRef.current) onCompleteRef.current();
            }
          });
        }
      });

      // --- Phase 1: 배경 반전 (White ➔ Black) 및 로고 컬러 스위치 (0s ~ 0.5s) ---
      // We also transition the logo to scale 0.9 and blur 10px so that it starts Phase 2 at the specified target states
      tl.to(preloaderRef.current, {
        backgroundColor: '#000000',
        duration: 0.5,
        ease: 'power2.out'
      }, 0)
      .to(logoRef.current, {
        filter: 'invert(1) blur(10px)',
        scale: 0.9,
        duration: 0.5,
        ease: 'power2.out'
      }, 0);

      // --- Phase 2: 마스크 오픈, 스케일 업 및 블러 해제 (0.5s ~ 2.0s) ---
      tl.to(logoContainerRef.current, {
        clipPath: 'inset(0 0% 0 0%)',
        duration: 1.5,
        ease: 'expo.inOut'
      }, 0.5)
      .to(logoRef.current, {
        x: 0, // Slide the image back to its natural centered position as the mask opens
        filter: 'invert(1) blur(0px)',
        scale: 1.0,
        duration: 1.5,
        ease: 'expo.inOut'
      }, 0.5);

      // --- Phase 3: 홀드 대기 (2.0s ~ 2.5s) ---
      tl.to({}, { duration: 0.5 }); // 0.5초 대기

    }, preloaderRef);

    return () => ctx.revert();
  }, []); // Empty dependency array to ensure the animation timeline is created exactly once on mount

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
        backgroundColor: '#ffffff',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        willChange: 'transform, opacity'
      }}
    >
      <div
        ref={logoContainerRef}
        style={{
          position: 'absolute',
          width: '600px', // Enlarged by 50% (from 400px)
          height: '60px',  // Enlarged by 50% (from 40px)
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform, clip-path, opacity'
        }}
      >
        <img 
          ref={logoRef}
          src="/logo-center.svg"
          alt="founded logo center"
          style={{
            position: 'absolute',
            width: '600px', // Enlarged by 50% (from 400px)
            height: 'auto',
            left: 0,
            top: 0,
            willChange: 'transform, filter, opacity'
          }}
        />
      </div>
    </div>
  );
}
