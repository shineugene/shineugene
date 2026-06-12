import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const BOXES_DATA = [
  { text: "Watch", color: "#F96565", fontSize: "5.25vw" },
  { text: "Listen", color: "#6DB2F2", fontSize: "5.95vw" },
  { text: "Read", color: "#C1E8E4", fontSize: "7vw" },
  { text: "Speak", color: "#E8A2D2", fontSize: "6.3vw" },
  { text: "Follow the Noise", color: "#B5E3AD", fontSize: "3.5vw" },
  { text: "found–from–Founded.", color: "#FFFFFF", fontSize: "3.5vw" }
];

export default function AboutPage() {
  const containerRef = useRef(null);
  const boxRefs = useRef([]);
  const [lang, setLang] = useState('ko');

  const handleBackClick = () => {
    window.location.hash = '/';
  };

  const toggleLang = () => {
    setLang(prev => prev === 'ko' ? 'en' : 'ko');
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Matter.js module aliases
    const { Engine, World, Bodies, Composite, Mouse, MouseConstraint } = Matter;

    // Create physics engine
    const engine = Engine.create({
      gravity: { y: 1 }
    });
    const { world } = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Boundary walls (static bodies)
    const bottomWall = Bodies.rectangle(width / 2, height + 50, width * 2, 100, {
      isStatic: true,
      friction: 0.1
    });

    const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 2, {
      isStatic: true,
      friction: 0.1
    });

    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 2, {
      isStatic: true,
      friction: 0.1
    });

    // Create card bodies dynamically using offsetWidth/Height on mount
    const bodies = BOXES_DATA.map((box, i) => {
      const el = boxRefs.current[i];
      const w = el ? el.offsetWidth : 200;
      const h = el ? el.offsetHeight : 80;

      // Freeze DOM dimensions in pixel values to prevent misalignment on resize
      if (el) {
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
      }

      // Safeguard startX bounds to prevent spawning offscreen on narrow screens
      const minX = w / 2;
      const maxX = Math.max(w / 2, width - w / 2);
      const startX = minX + Math.random() * (maxX - minX);
      
      // Stagger spawn vertically to prevent overlaps
      const startY = -150 - i * 250;

      const body = Bodies.rectangle(startX, startY, w, h, {
        restitution: 0.55,
        friction: 0.1,
        frictionAir: 0.02,
        angle: (Math.random() - 0.5) * 0.6
      });

      body.renderWidth = w;
      body.renderHeight = h;

      return body;
    });

    // Add boundaries and bodies to world
    Composite.add(world, [bottomWall, leftWall, rightWall, ...bodies]);

    // Setup mouse constraints bound to containerRef.current
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Composite.add(world, mouseConstraint);

    // Disable mouse scroll events to prevent Chrome passive listener warnings
    if (mouse.element) {
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
    }

    // Resize handler to update boundaries dynamically
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      Matter.Body.setPosition(bottomWall, { x: newWidth / 2, y: newHeight + 50 });
      Matter.Body.setPosition(leftWall, { x: -50, y: newHeight / 2 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 50, y: newHeight / 2 });
    };
    window.addEventListener('resize', handleResize);

    // Animation frame loop
    let animFrameId;
    const updatePhysics = () => {
      Engine.update(engine, 1000 / 60);

      // Sync Matter.js positions to React HTML DOM elements
      bodies.forEach((body, i) => {
        const el = boxRefs.current[i];
        if (el) {
          const { x, y } = body.position;
          const { angle } = body;
          const w = body.renderWidth;
          const h = body.renderHeight;

          el.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${angle}rad)`;
        }
      });

      animFrameId = requestAnimationFrame(updatePhysics);
    };
    animFrameId = requestAnimationFrame(updatePhysics);

    // Cleanup physics engine and listeners on unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      
      if (mouse.element) {
        Mouse.clearSourceEvents(mouse);
      }
      
      World.clear(world);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FEFBC6', // Layer 1: background
        color: '#1d1d1d',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
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
          color: '#1d1d1d',
          zIndex: 100,
          pointerEvents: 'auto'
        }}
      >
        ← Back
      </div>

      {/* Language Toggle Button (exactly horizontal aligned with Back button) */}
      <div 
        onClick={toggleLang}
        style={{
          position: 'absolute',
          top: '43px',
          right: '40px',
          fontFamily: "'Aeonik-SemiBold', sans-serif",
          fontWeight: 600,
          fontSize: '20px',
          letterSpacing: '-0.03em',
          cursor: 'pointer',
          userSelect: 'none',
          color: '#1d1d1d',
          zIndex: 100,
          pointerEvents: 'auto'
        }}
      >
        {lang === 'ko' ? 'EN' : 'KR'}
      </div>

      {/* Layer 2: Description Text (Positioned at top margin to prevent box overlaps) */}
      <div
        style={{
          position: 'absolute',
          top: '120px',
          left: '40px',
          right: '40px',
          zIndex: 2,
          fontFamily: "'BookkGothic-Bold', sans-serif",
          fontSize: '30px',
          lineHeight: 1.5,
          color: '#1d1d1d',
          letterSpacing: '-0.03em',
          textAlign: 'left',
          pointerEvents: 'none', // Let mouse events pass to background wrapper for physics dragging
          userSelect: 'none'
        }}
      >
        {lang === 'ko' ? (
          <>
            <p style={{ margin: '0 0 16px 0' }}>
              파운드파운디드는 2016년 설립된 크리에이티브 디자인 스튜디오로, 산업통상자원부와 한국디자인진흥원이 선정한 우수디자인전문기업입니다.
            </p>
            <p style={{ margin: '0 0 16px 0' }}>
              공간디자인, 제품디자인, 가구디자인, 브랜딩, 그래픽 디자인, UX/UI 디자인 등 다양한 분야를 아우르며 통합적인 디자인 경험을 제공합니다.
            </p>
            <p style={{ margin: '0 0 16px 0' }}>
              삼성전자, 제일기획, 현대카드, LG생활건강, 삼성물산, 데싱디바, 롯데케미칼 등 국내외 주요 기업들과 협업하며 대한민국을 대표하는 디자인 스튜디오로 성장해왔습니다.
            </p>
            <p style={{ margin: 0 }}>
              파운드파운디드는 기획부터 디자인 전략 수립, 디자인, 양산 솔루션 까지 전 과정을 유연하게 아우르며, 창의적이고 완성도 높은 사용자 경험을 제안합니다.
            </p>
          </>
        ) : (
          <>
            <p style={{ margin: '0 0 16px 0' }}>
              Founded in 2016, Found Founded is a creative design studio recognized as an Excellent Design Specialized Company by the Ministry of Trade, Industry and Energy and the Korea Institute of Design Promotion.
            </p>
            <p style={{ margin: '0 0 16px 0' }}>
              We provide integrated design experiences across diverse fields including spatial design, product design, furniture design, branding, graphic design, and UX/UI design.
            </p>
            <p style={{ margin: '0 0 16px 0' }}>
              Collaborating with major domestic and international companies such as Samsung Electronics, Cheil Worldwide, Hyundai Card, LG Household & Health Care, Samsung C&T, Dessini Diva, and Lotte Chemical, we have grown into one of Korea's leading design studios.
            </p>
            <p style={{ margin: 0 }}>
              Found Founded encompasses the entire process from planning and design strategy development to design execution and production solutions with flexibility, proposing creative and highly refined user experiences.
            </p>
          </>
        )}
      </div>

      {/* Layer 3: Physics HTML Text boxes */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        pointerEvents: 'none' // Let events pass to container for dragging constraints
      }}>
        {BOXES_DATA.map((box, i) => (
          <div
            key={i}
            ref={el => boxRefs.current[i] = el}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              fontSize: box.fontSize,
              backgroundColor: box.color,
              border: 'none',
              borderRadius: '2px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontFamily: "'Aeonik-SemiBold', sans-serif",
              fontWeight: 600,
              color: '#000000',
              letterSpacing: '-0.03em',
              padding: '0.01em 0.1em', // Ultra-tight padding
              lineHeight: 0.9,
              userSelect: 'none',
              cursor: 'grab',
              boxSizing: 'border-box',
              whiteSpace: 'nowrap', // Prevent line wrapping
              width: 'max-content', // Prevent text overflow
              transform: 'translate(-9999px, -9999px)', // Offscreen initially
              willChange: 'transform',
              pointerEvents: 'auto' // Re-enable clicks/drags on individual cards
            }}
          >
            {box.text}
          </div>
        ))}
      </div>
    </div>
  );
}
