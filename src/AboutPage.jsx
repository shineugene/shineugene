import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const BOXES_DATA = [
  { text: "Watch", color: "#F96565", fontSize: "11rem" },
  { text: "Listen", color: "#6DB2F2", fontSize: "12rem" },
  { text: "Read", color: "#C1E8E4", fontSize: "14rem" },
  { text: "Speak", color: "#E8A2D2", fontSize: "13rem" },
  { text: "Follow the Noise", color: "#B5E3AD", fontSize: "8.5rem" },
  { text: "found–from–Founded.", color: "#FFFFFF", fontSize: "7.5rem" }
];

export default function AboutPage() {
  const containerRef = useRef(null);
  const boxRefs = useRef([]);

  const handleBackClick = () => {
    window.location.hash = '/';
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
      const w = el ? el.offsetWidth : 400;
      const h = el ? el.offsetHeight : 150;

      // Freeze DOM dimensions in pixel values to prevent misalignment on resize
      if (el) {
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
      }

      // Safeguard startX bounds to prevent spawning offscreen on narrow screens
      const minX = w / 2;
      const maxX = Math.max(w / 2, width - w / 2);
      const startX = minX + Math.random() * (maxX - minX);
      
      // Increased vertical stagger offset (400px) to prevent massive cards from colliding offscreen
      const startY = -200 - i * 400;

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

    // Setup mouse constraints for dragging/throwing interactions
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

      {/* Layer 2: Physics HTML Text boxes (rendered on top of solid background) */}
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
