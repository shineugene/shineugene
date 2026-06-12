import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
  const containerRef = useRef();
  const svgRef = useRef();
  
  // SVG Groups
  const foundGroupRef = useRef();
  const foundedGroupRef = useRef();
  const slashRef = useRef();
  
  // Geometric overlay lines (Phase 1)
  const geoLine1Ref = useRef();
  const geoLine2Ref = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State Setups
      gsap.set([foundGroupRef.current, foundedGroupRef.current], { opacity: 0 });
      gsap.set(slashRef.current, { opacity: 0 });
      
      // Setup geo lines: crossing diagonally in the center of the slash
      gsap.set(geoLine1Ref.current, {
        rotation: -90,
        scale: 0.1,
        stroke: '#ffffff',
        opacity: 1
      });
      gsap.set(geoLine2Ref.current, {
        rotation: 90,
        scale: 0.1,
        stroke: '#ffffff',
        opacity: 1
      });

      const tl = gsap.timeline({
        onComplete: () => {
          // Phase 4: Wipe up preloader container and complete
          gsap.to(containerRef.current, {
            y: '-100%',
            opacity: 0,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
              if (onComplete) onComplete();
            }
          });
        }
      });

      // --- PHASE 1: Geometric Line Motion (0s ~ 1s) ---
      tl.to([geoLine1Ref.current, geoLine2Ref.current], {
        scale: 1.0,
        duration: 0.5,
        ease: 'power2.out'
      })
      .to(geoLine1Ref.current, {
        rotation: -360, // Spin into alignment
        duration: 0.8,
        ease: 'power3.inOut'
      }, 0.2)
      .to(geoLine2Ref.current, {
        rotation: 360, // Spin opposite direction
        duration: 0.8,
        ease: 'power3.inOut'
      }, 0.2);

      // --- PHASE 2: Background Inversion & Merge into Slash (1s ~ 1.5s) ---
      tl.to(containerRef.current, {
        backgroundColor: '#ffffff',
        duration: 0.3,
        ease: 'power2.out'
      }, 1.0)
      .to([geoLine1Ref.current, geoLine2Ref.current], {
        stroke: '#000000',
        duration: 0.3,
        ease: 'power2.out'
      }, 1.0)
      // Snap both lines to 0 rotation (the exact slash angle)
      .to(geoLine1Ref.current, {
        rotation: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 1.0)
      .to(geoLine2Ref.current, {
        rotation: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 1.0)
      // Fade in the actual SVG slash polygon in black
      .fromTo(slashRef.current, {
        opacity: 0,
        fill: '#000000'
      }, {
        opacity: 1,
        fill: '#000000',
        duration: 0.2,
        ease: 'power2.out'
      }, 1.15);

      // --- PHASE 3: Revert BG to Black & Slide-out Texts (1.5s ~ 2.4s) ---
      tl.to(containerRef.current, {
        backgroundColor: '#000000',
        duration: 0.3,
        ease: 'power2.inOut'
      }, 1.5)
      .to(slashRef.current, {
        fill: '#ffffff',
        duration: 0.3,
        ease: 'power2.inOut'
      }, 1.5)
      // Slide-out found and founded groups from behind the slash mask
      .fromTo(foundGroupRef.current, {
        x: -180,
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out'
      }, 1.6)
      .fromTo(foundedGroupRef.current, {
        x: 180,
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out'
      }, 1.6);

      // --- PHASE 4: Hold (2.4s ~ 2.9s) ---
      tl.to({}, { duration: 0.5 }); // Keep logo visible for a moment

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
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
      <div style={{ position: 'relative', width: '75%', maxWidth: '680px', height: 'auto' }}>
        
        {/* Core Logo SVG */}
        <svg 
          ref={svgRef}
          viewBox="0 0 3976.98 387.33" 
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            {/* Mathematical mask boundaries using the diagonal edge vectors of the logo's slash */}
            {/* Left slash edge goes from [1619.85, 0] to [1468.08, 383.43] */}
            <clipPath id="clip-found">
              <polygon points="0,0 1619.85,0 1468.08,387.33 0,387.33" />
            </clipPath>
            {/* Right slash edge goes from [1699.97, 0] to [1548.19, 383.43] */}
            <clipPath id="clip-founded">
              <polygon points="1699.97,0 3976.98,0 3976.98,387.33 1548.19,387.33" />
            </clipPath>
          </defs>

          {/* Geometric lines (Phase 1 & 2): Drawn precisely along the slash axis */}
          <line 
            ref={geoLine1Ref}
            x1="1468.08" y1="383.43" x2="1699.97" y2="0"
            style={{ 
              transformOrigin: '1584px 191.71px', 
              strokeWidth: 80, 
              strokeLinecap: 'butt' 
            }}
          />
          <line 
            ref={geoLine2Ref}
            x1="1468.08" y1="383.43" x2="1699.97" y2="0"
            style={{ 
              transformOrigin: '1584px 191.71px', 
              strokeWidth: 80, 
              strokeLinecap: 'butt' 
            }}
          />

          <g id="logo-body">
            {/* 1. left: found text group (masked) */}
            <g ref={foundGroupRef} clipPath="url(#clip-found)">
              {/* f */}
              <path fill="#ffffff" d="M33.2,102.79v7.1H0v42.58h33.2v225.71h50.56v-225.71h65.13v-42.58h-65.13v-6.05c0-49.49,36.34-55.82,55.84-55.82,7.92,0,14.13,1.33,14.13,1.33V5.66s-8.86-1.88-20.44-1.88c-33.73,0-100.09,11.05-100.09,99v.02Z"/>
              {/* o */}
              <path fill="#ffffff" d="M308.28,103.32c-77.67,0-140.64,63.56-140.64,141.92s62.97,141.91,140.64,141.91,140.63-63.53,140.63-141.91-62.97-141.92-140.63-141.92h0ZM308.28,337.92c-50.65,0-91.87-41.6-91.87-92.68s41.2-92.69,91.87-92.69,91.84,41.58,91.84,92.69-41.22,92.68-91.84,92.68h0Z"/>
              {/* u */}
              <path fill="#ffffff" d="M689.6,264.19c0,48.07-23.96,74.53-67.46,74.53s-67.86-27.9-67.86-76.5V109.65h-51.91v154.54c0,78.1,43.37,122.88,118.98,122.88s120.19-45.63,120.19-125.21V109.65h-51.93v154.54h-.01Z"/>
              {/* n */}
              <path fill="#ffffff" d="M1013.87,115.25h0s-.01,0-.03-.01c-.1-.06-.21-.11-.3-.17-22.43-13.02-48.25-13.17-65.26-11.23-5.3.55-10.34,1.42-15.13,2.59-2.23.53-3.47.89-3.47.89h0c-37.81,10.4-59.57,38.16-67.94,56.58h-1.05s1.05-8.89,1.05-19.37v-35.07h-49.22v271.37h50.79v-130.59c0-13.09,1.05-25.12,4.19-35.59,9.73-33.81,36.27-58.6,70.2-63.85,13.34-1.99,36.61-2.23,52.04,15.67,2.74,3.39,6.49,9.34,8.8,18.34.3,1.25.58,2.52.83,3.8,0,.04,0,.07.01.1,1.61,8.34,2.16,17.65,2.16,27.5v164.61h50.79v-176.13c0-44.26-12.39-74.13-38.48-89.46v.03Z"/>
              {/* d */}
              <path fill="#ffffff" d="M1333.08,151.83c-20.83-29.91-52.8-48.88-93.09-48.88-73.93,0-133.89,63.67-133.89,142.2s59.96,142.19,133.89,142.19c40.29,0,72.25-18.99,93.09-48.9v42.41h51.11V6.87h-51.11v144.95h0ZM1243.83,332.98c-47.58,0-86.27-39.28-86.27-87.56s38.68-87.57,86.27-87.57,86.28,39.29,86.28,87.57-38.72,87.56-86.28,87.56h0Z"/>
            </g>

            {/* 2. center: / slash (transforms fill color) */}
            <polygon 
              ref={slashRef}
              fill="#ffffff" 
              points="1468.08 383.43 1548.19 383.43 1699.97 0 1619.85 0 1468.08 383.43"
            />

            {/* 3. right: Founded text group (masked) */}
            <g ref={foundedGroupRef} clipPath="url(#clip-founded)">
              {/* F */}
              <polygon fill="#ffffff" points="1757.37 380.35 1849.15 380.35 1849.15 239.07 2017.56 239.07 2017.56 160.49 1849.15 160.49 1849.15 81.86 2041.16 81.86 2041.16 4.7 1757.37 4.7 1757.37 380.35 1757.37 380.35 1757.37 380.35"/>
              {/* o */}
              <path fill="#ffffff" d="M2203.82,102.9c-78.09,0-141.43,63.59-141.43,142.01s63.35,142.03,141.43,142.03,141.43-63.59,141.43-142.03-63.29-142.01-141.43-142.01h0ZM2203.82,309.54c-35.47,0-64.33-28.99-64.33-64.63s28.86-64.63,64.33-64.63,64.38,28.99,64.38,64.63-28.88,64.63-64.38,64.63h0Z"/>
              {/* u */}
              <path fill="#ffffff" d="M2567.94,252.5c0,34.11-15.09,51.4-44.81,51.4s-44.83-17.97-44.83-53.34V109.78h-87.73v142.34c0,85.67,48.05,134.81,131.8,134.81s133.31-49.85,133.31-136.78V109.78h-87.73v142.73h0Z"/>
              {/* n */}
              <path fill="#ffffff" d="M2911.85,103.68c-.69-.11-1.38-.19-2.06-.29-15.57-2.17-29.05-1.77-40.66.3-40.25,7.18-58.05,34.21-62.43,42.07-.76,1.37-1.12,2.16-1.12,2.16l-.89-1.02c.28-2.38.89-8.59.89-15.42v-23.14h-85.42v270.62h89.03v-122.96c0-11.36,1.18-27.62,3.94-38.36h0s7.32-41.24,51.71-37.39h0s23.17.04,29.67,21.34c0,0,1.66,5.2,1.66,20.04v157.32h89.02v-177.52c0-64.06-30.75-91.32-73.34-97.73v-.03Z"/>
              {/* d */}
              <path fill="#ffffff" d="M3239.82,130.53c-18.95-17.61-43.71-28.15-73.77-28.15-74.25,0-134.48,63.57-134.48,141.98s60.23,141.99,134.48,141.99c30.14,0,53.49-12.28,73.77-32.52v25.11h88.23V7.21h-88.23v123.32h0ZM3173.5,309.6c-35.26,0-64-29.27-64-65.26s28.73-65.24,64-65.24,64,29.28,64,65.24-28.7,65.26-64,65.26h0Z"/>
              {/* e */}
              <path fill="#ffffff" d="M3645.35,261.01c7.58-60.45-13.91-98.68-37.13-121.75-25.55-22.92-59.47-36.89-96.7-36.89-79.39,0-141.22,63.52-141.35,141.91v2.05c.3,24.41,6.84,47.35,18.12,67.34.11.19.21.37.32.57.24.42.47.83.71,1.24,6.06,10.5,13.54,20.27,22.38,28.99,19.25,19.25,45.56,33.09,73.33,39.02.04,0,.07.01.11.03.75.17,1.51.32,2.26.47.21.04.4.08.61.11.62.12,1.25.23,1.88.34.86.15,1.7.31,2.56.44.12.01.25.04.37.05.82.12,1.62.25,2.44.36.36.06.71.1,1.07.15.69.1,1.37.18,2.06.26.5.06.98.11,1.48.17.61.07,1.2.12,1.81.18.6.06,1.19.11,1.79.15.54.04,1.07.08,1.61.12.68.06,1.37.08,2.06.12.47.03.93.05,1.4.08.8.04,1.62.07,2.44.1.36,0,.72.03,1.07.04,1.18.03,2.35.04,3.53.04h0c4.87,0,9.67-.25,14.41-.71,24.79-2.45,47.71-11.13,67.17-24.47h0c.44-.3.89-.61,1.31-.93,12.4-8.7,23.36-19.28,32.44-31.34.8-1.07,1.58-2.13,2.35-3.22h-.03c3.25-4.45,6.05-8.73,8.33-12.66l-67.94-34.76c-.15.23-.32.46-.47.69-2.33,3.29-13.26,17.66-31.54,25.48-7.29,2.93-15.32,4.69-23.29,5.02-.91.04-1.84.06-2.77.06-.64,0-1.27-.01-1.91-.04-.26,0-.54-.02-.8-.03-25.17-1.02-47.17-16.21-57.2-37.71-1.51-3.22-2.82-7.55-3.2-11.08h192.93v-.02h.01ZM3455.47,208.57h-.91s3.9-41.06,54.35-41.47c50.45.42,54.35,41.47,54.35,41.47h-107.79Z"/>
              {/* d */}
              <path fill="#ffffff" d="M3888.76,130.53c-18.96-17.61-43.72-28.15-73.77-28.15-74.27,0-134.5,63.57-134.5,141.98s60.23,141.99,134.5,141.99c30.14,0,53.49-12.28,73.77-32.52v25.11h88.22V7.21h-88.22v123.32h0ZM3822.42,309.6c-35.28,0-64.01-29.27-64.01-65.26s28.72-65.24,64.01-65.24,64,29.28,64,65.24-28.72,65.26-64,65.26h0Z"/>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
