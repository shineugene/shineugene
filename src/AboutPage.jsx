import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import Matter from 'matter-js';

const BOXES_DATA = [
  { text: "Watch", color: "#F96565", fontSize: "9.5vw" },
  { text: "Listen", color: "#6DB2F2", fontSize: "10vw" },
  { text: "Read", color: "#C1E8E4", fontSize: "11.5vw" },
  { text: "Speak", color: "#E8A2D2", fontSize: "10.5vw" },
  { text: "Follow the Noise", color: "#B5E3AD", fontSize: "7.2vw" },
  { text: "found–from–Founded.", color: "#FFFFFF", fontSize: "6.2vw" }
];

function VideoSphere({ mouseRef }) {
  const meshRef = useRef();
  const [videoTexture, setVideoTexture] = useState(null);

  useEffect(() => {
    // Manually load and configure HTML5 video to prevent rendering blocks
    const video = document.createElement('video');
    video.src = '/about-video.mp4';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.crossOrigin = 'anonymous';

    const handleCanPlay = () => {
      const texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      setVideoTexture(texture);
    };

    video.addEventListener('canplaythrough', handleCanPlay);
    video.play().catch(err => {
      console.warn("Video playback was blocked or failed to load:", err);
    });

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.pause();
      video.src = '';
      video.load();
    };
  }, []);

  const passiveRotY = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Slow, continuous passive rotation to keep the sphere alive when stationary
    passiveRotY.current += delta * 0.05;

    // Target rotation based on pointer coordinates [-1, 1] plus passive rotation
    const targetRotX = mouseRef.current.y * 0.45;
    const targetRotY = mouseRef.current.x * 0.45 + passiveRotY.current;

    // Smooth lerp rotation for elastic response
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshPhysicalMaterial
        map={videoTexture || null}
        color={videoTexture ? '#ffffff' : '#fefbc6'} // Warm background matching color when loading
        roughness={0.1}
        metalness={0.15}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        reflectivity={0.95}
        transmission={videoTexture ? 0.0 : 0.45} // Translucent glass effect if video isn't ready
        thickness={1.2}
      />
    </mesh>
  );
}

export default function AboutPage() {
  const containerRef = useRef(null);
  const boxRefs = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const handleBackClick = () => {
    window.location.hash = '/';
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Track pointer globally (handles mouse & touch) to rotate sphere while interacting
    const handlePointerMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', handlePointerMove);

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
      const w = el ? el.offsetWidth : 300;
      const h = el ? el.offsetHeight : 100;

      // Freeze DOM dimensions in pixel values to prevent misalignment on resize
      if (el) {
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
      }

      // Safeguard startX bounds to prevent spawning offscreen on narrow screens
      const minX = w / 2;
      const maxX = Math.max(w / 2, width - w / 2);
      const startX = minX + Math.random() * (maxX - minX);
      const startY = -120 - i * 180;

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
    let frameCount = 0;
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
      window.removeEventListener('pointermove', handlePointerMove);
      
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

      {/* Layer 2: 3D Video Sphere Canvas */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 5,
        pointerEvents: 'none' // Allow mouse events to pass through to container for Matter.js dragging
      }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 3, 5]} intensity={0.8} />
          <pointLight position={[-3, -3, 3]} intensity={0.3} />
          <Suspense fallback={null}>
            <VideoSphere mouseRef={mouseRef} />
          </Suspense>
          <Environment preset="city" />
        </Canvas>
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
              padding: '0.02em 0.15em',
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
