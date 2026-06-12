import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef();
  const leftCircleRef = useRef();
  const rightCircleRef = useRef();
  const logoWrapperRef = useRef();
  const logoRef = useRef();
  const greetingTextRef = useRef();

  // Keep a stable reference to the onComplete callback to avoid triggering useEffect runs
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state values via GSAP to ensure precision
      gsap.set(preloaderRef.current, {
        backgroundColor: '#ffffff'
      });
      gsap.set(leftCircleRef.current, { 
        attr: { r: 0 },
        x: 0 
      });
      gsap.set(rightCircleRef.current, { 
        attr: { r: 0 },
        x: 0 
      });
      gsap.set(logoWrapperRef.current, { 
        opacity: 0,
        filter: 'blur(15px)'
      });
      gsap.set(greetingTextRef.current, { 
        opacity: 0
      });

      const tl = gsap.timeline({
        onComplete: () => {
          if (onCompleteRef.current) onCompleteRef.current();
        }
      });

      // --- Phase 1: 망원경 시야 열림 (0s ~ 1.0s) ---
      // The circles expand and separate horizontally, cutting a figure-8 shape in the mask
      tl.to(leftCircleRef.current, {
        attr: { r: 260 },
        x: -120,
        duration: 1.0,
        ease: 'power3.inOut'
      }, 0)
      .to(rightCircleRef.current, {
        attr: { r: 260 },
        x: 120,
        duration: 1.0,
        ease: 'power3.inOut'
      }, 0);

      // --- Phase 2: 로고 스르륵 포커싱 (1.0s ~ 2.0s) ---
      tl.to(logoWrapperRef.current, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.0,
        ease: 'power2.out'
      }, 1.0);

      // --- Phase 3: 환영 문구로 전환 (2.5s ~ 3.5s) ---
      // Logo fades out and the greeting text fades in in parallel
      tl.to(logoWrapperRef.current, {
        opacity: 0,
        duration: 1.0,
        ease: 'power2.inOut'
      }, 2.5)
      .to(greetingTextRef.current, {
        opacity: 1,
        duration: 1.0,
        ease: 'power2.inOut'
      }, 2.5);

      // --- Phase 4: 화면 입장 (4.0s ~ 4.8s) ---
      // Hold for 0.5s (3.5s to 4.0s) then swipe up the preloader
      tl.to(preloaderRef.current, {
        y: '-100%',
        duration: 0.8,
        ease: 'power3.inOut'
      }, 4.0);

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
        backgroundColor: '#ffffff',
        zIndex: 9999,
        overflow: 'hidden',
        userSelect: 'none',
        willChange: 'transform'
      }}
    >
      {/* Centered Content Layer (behind the SVG mask) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '250px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        {/* Logo Wrapper */}
        <div
          ref={logoWrapperRef}
          style={{
            position: 'absolute',
            width: '600px',
            maxWidth: '90vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            willChange: 'opacity, filter'
          }}
        >
          <img 
            ref={logoRef}
            src="/logo-center.svg"
            alt="founded logo center"
            style={{
              width: '600px',
              maxWidth: '90vw',
              height: 'auto'
            }}
          />
        </div>

        {/* Greeting Text */}
        <div
          ref={greetingTextRef}
          style={{
            position: 'absolute',
            fontFamily: "'Aeonik-SemiBold', sans-serif",
            fontWeight: 600,
            fontSize: '44px',
            lineHeight: '1.3',
            letterSpacing: '-0.03em',
            color: '#000000',
            textAlign: 'center',
            willChange: 'opacity'
          }}
        >
          Hi, there!<br />
          You Found Us.
        </div>
      </div>

      {/* Binocular Viewfinder SVG Overlay Mask */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 20
        }}
      >
        <defs>
          {/* Blur filter to create soft vignetting edge */}
          <filter id="binoculars-blur">
            <feGaussianBlur stdDeviation="25" />
          </filter>
          <mask id="binoculars-mask">
            {/* White base makes everything visible (keeps the black overlay solid) */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black circles cut transparent holes to reveal content behind */}
            <g filter="url(#binoculars-blur)">
              <circle
                ref={leftCircleRef}
                cx="50%"
                cy="50%"
                r="0"
                fill="black"
              />
              <circle
                ref={rightCircleRef}
                cx="50%"
                cy="50%"
                r="0"
                fill="black"
              />
            </g>
          </mask>
        </defs>
        {/* Full-screen black rectangle masked by the binocular holes */}
        <rect
          width="100%"
          height="100%"
          fill="#000000"
          mask="url(#binoculars-mask)"
        />
      </svg>
    </div>
  );
}
