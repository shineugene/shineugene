import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const preloaderRef = useRef();
  const linesRef = useRef();
  const l1Ref = useRef();
  const l2Ref = useRef();
  const l3Ref = useRef();
  const logoRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Setup initial CSS properties via GSAP to ensure precision
      gsap.set([l1Ref.current, l2Ref.current, l3Ref.current], {
        scaleY: 0,
        rotation: 0,
        height: '120px',
        backgroundColor: '#ffffff'
      });
      gsap.set(logoRef.current, {
        opacity: 0,
        clipPath: 'inset(0 50% 0 50%)'
      });

      const tl = gsap.timeline({
        onComplete: () => {
          // Phase 4: Swipe up preloader container and notify parent to start 3D fade-in
          gsap.to(preloaderRef.current, {
            y: '-100%',
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
              if (onComplete) onComplete();
            }
          });
        }
      });

      // --- Phase 1: 얇은 선 등장 및 별(*) 모양 완성 (0s ~ 1s) ---
      // 1. scaleY 0 -> 1 등장 (0.4초)
      tl.to([l1Ref.current, l2Ref.current, l3Ref.current], {
        scaleY: 1,
        duration: 0.4,
        ease: 'power3.out'
      })
      // 2. 빠르게 분할되며 별 모양 완성 (0.5초, ease: power4.inOut)
      .to(l2Ref.current, {
        rotation: 60,
        duration: 0.5,
        ease: 'power4.inOut'
      }, 0.3)
      .to(l3Ref.current, {
        rotation: -60,
        duration: 0.5,
        ease: 'power4.inOut'
      }, 0.3);

      // --- Phase 2: 슬래시(/) 형태로 결합 및 배경 반전 (1s ~ 2s) ---
      // 1. 배경 흰색으로 변경 & 선 검은색으로 변경 (0.4초)
      tl.to(preloaderRef.current, {
        backgroundColor: '#ffffff',
        duration: 0.4,
        ease: 'power2.out'
      }, 1.0)
      .to([l1Ref.current, l2Ref.current, l3Ref.current], {
        backgroundColor: '#000000',
        duration: 0.4,
        ease: 'power2.out'
      }, 1.0)
      // 2. 별 모양이 슬래시(/)로 결합 (l1, l2, l3 모두 rotate: 20deg) (0.6초, ease: back.inOut(1.5))
      // 겹쳐진 선들의 높이를 logo-center.svg의 슬래시 높이(가로 400px 기준 약 39px)로 축소
      .to([l1Ref.current, l2Ref.current, l3Ref.current], {
        rotation: 20,
        height: '39px',
        duration: 0.6,
        ease: 'back.inOut(1.5)'
      }, 1.0);

      // --- Phase 3: 마스크가 열리며 로고 완성 (2s ~ 3s) ---
      // 1. 배경 블랙 & 선 화이트로 반전 (0.3초)
      tl.to(preloaderRef.current, {
        backgroundColor: '#000000',
        duration: 0.3,
        ease: 'power2.inOut'
      }, 2.0)
      .to([l1Ref.current, l2Ref.current, l3Ref.current], {
        backgroundColor: '#ffffff',
        duration: 0.3,
        ease: 'power2.inOut'
      }, 2.0)
      // 2. 선 사라지기 & 로고 opacity 1 켜기 (동시 진행)
      .to(linesRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out'
      }, 2.15)
      .to(logoRef.current, {
        opacity: 1,
        duration: 0.1,
        ease: 'none'
      }, 2.15)
      // 3. 로고 clip-path 마스킹 열기 (0.8초, ease: power4.inOut)
      .to(logoRef.current, {
        clipPath: 'inset(0 0% 0 0%)',
        duration: 0.8,
        ease: 'power4.inOut'
      }, 2.2);

      // --- Phase 4: 프리로더 종료 및 대기 (3.0s ~ 3.5s) ---
      tl.to({}, { duration: 0.5 }); // 0.5초 홀드 대기 (3.0초 ~ 3.5초)

    }, preloaderRef);

    return () => ctx.revert();
  }, [onComplete]);

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
        userSelect: 'none'
      }}
    >
      {/* Center Wrapper to align lines and logo exact middle */}
      <div style={{ position: 'relative', width: '400px', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {/* Geometric Lines wrapper */}
        <div 
          ref={linesRef}
          className="lines"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 15
          }}
        >
          <div 
            ref={l1Ref} 
            className="line l1" 
            style={{
              position: 'absolute',
              width: '6px',
              height: '120px',
              backgroundColor: '#ffffff',
              transformOrigin: 'center center',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
          <div 
            ref={l2Ref} 
            className="line l2" 
            style={{
              position: 'absolute',
              width: '6px',
              height: '120px',
              backgroundColor: '#ffffff',
              transformOrigin: 'center center',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
          <div 
            ref={l3Ref} 
            className="line l3" 
            style={{
              position: 'absolute',
              width: '6px',
              height: '120px',
              backgroundColor: '#ffffff',
              transformOrigin: 'center center',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>

        {/* Text Logo: SVG Center alignment */}
        <img 
          ref={logoRef}
          src="/logo-center.svg"
          alt="founded logo center"
          style={{
            position: 'absolute',
            width: '400px',
            height: 'auto',
            zIndex: 10,
            opacity: 0,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            clipPath: 'inset(0 50% 0 50%)'
          }}
        />

      </div>
    </div>
  );
}
