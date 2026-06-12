import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const BOXES_DATA = [
  { text: "Watch", color: "#F96565", w: 130, h: 54 },
  { text: "Listen", color: "#6DB2F2", w: 140, h: 58 },
  { text: "Read", color: "#C1E8E4", w: 120, h: 50 },
  { text: "Speak", color: "#E8A2D2", w: 130, h: 56 },
  { text: "Follow the Noise", color: "#B5E3AD", w: 260, h: 64 },
  { text: "found–from–Founded.", color: "#FFFFFF", w: 330, h: 64 }
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
      gravity: { y: 1 } // Standard gravity scale
    });
    const { world } = engine;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Boundary walls (static bodies)
    // Bottom wall: 100px height, centered horizontally, placed just below the viewport height
    const bottomWall = Bodies.rectangle(width / 2, height + 50, width * 2, 100, {
      isStatic: true,
      friction: 0.1
    });

    // Left wall: 100px width, placed left of viewport
    const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 2, {
      isStatic: true,
      friction: 0.1
    });

    // Right wall: 100px width, placed right of viewport
    const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 2, {
      isStatic: true,
      friction: 0.1
    });

    // Create card bodies
    const bodies = BOXES_DATA.map((box, i) => {
      // Distribute starting X position randomly
      const startX = 100 + Math.random() * (width - 200 - box.w);
      // Stack start Y positions above viewport to fall down sequentially
      const startY = -80 - i * 120;

      return Bodies.rectangle(startX, startY, box.w, box.h, {
        restitution: 0.55, // Bounciness
        friction: 0.1,
        frictionAir: 0.02, // Air resistance for nice physical momentum
        angle: (Math.random() - 0.5) * 0.5 // Random initial rotation angle
      });
    });

    // Add boundaries and bodies to the world
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

    // Disable mouse scroll interception on Matter.js mouse to avoid passive Chrome listener errors
    if (mouse.element) {
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
    }

    // Resize handler to update static boundaries dynamically on window dimensions changes
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      Matter.Body.setPosition(bottomWall, { x: newWidth / 2, y: newHeight + 50 });
      Matter.Body.setPosition(leftWall, { x: -50, y: newHeight / 2 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 50, y: newHeight / 2 });
    };
    window.addEventListener('resize', handleResize);

    // Animation render loop
    let animFrameId;
    const updatePhysics = () => {
      Engine.update(engine, 1000 / 60);

      // Sync Matter.js positions to React HTML DOM elements
      bodies.forEach((body, i) => {
        const el = boxRefs.current[i];
        if (el) {
          const box = BOXES_DATA[i];
          const { x, y } = body.position;
          const { angle } = body;

          // Align the top-left of absolute div by offsetting with half-width/height
          el.style.transform = `translate(${x - box.w / 2}px, ${y - box.h / 2}px) rotate(${angle}rad)`;
        }
      });

      animFrameId = requestAnimationFrame(updatePhysics);
    };
    animFrameId = requestAnimationFrame(updatePhysics);

    // Cleanup physics engine and event listeners on component unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      
      // Clean mouse events explicitly
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
        backgroundColor: '#FEFBC6', // Pale yellow brand background
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

      {/* Physics HTML Text boxes */}
      {BOXES_DATA.map((box, i) => (
        <div
          key={i}
          ref={el => boxRefs.current[i] = el}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${box.w}px`,
            height: `${box.h}px`,
            backgroundColor: box.color,
            border: '2px solid #000000',
            borderRadius: '2px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Aeonik-SemiBold', sans-serif",
            fontWeight: 600,
            fontSize: '22px',
            color: '#000000',
            letterSpacing: '-0.03em',
            userSelect: 'none',
            cursor: 'grab',
            boxSizing: 'border-box',
            transform: 'translate(-999px, -999px)', // Offscreen initially to prevent FOUC pops
            willChange: 'transform'
          }}
        >
          {box.text}
        </div>
      ))}
    </div>
  );
}
