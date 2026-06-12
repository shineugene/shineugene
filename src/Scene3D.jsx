import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';

const IMAGE_NUMBERS = Array.from({ length: 20 }, (_, i) => String(i + 1).padStart(2, '0'));
const TOTAL = IMAGE_NUMBERS.length;

// Radius slightly expanded to 2.05 (~6% expansion from 1.936) to give cards breathing room
const RADIUS_CIRCLE = 2.05;
const ORBIT_SPEED = 0.05; // ~58% speed reduction for calm movement

function ImageCard({ 
  url, 
  targetPosition, 
  index, 
  isHovered, 
  isClicked, 
  isCircleReady, 
  setIsCircleReady,
  isHoverPaused,
  selectedCardIndex,
  setSelectedCardIndex,
  setIsClicked
}) {
  const texture = useTexture(url);
  const meshRef = useRef();
  const materialRef = useRef();
  const [cardHovered, setCardHovered] = useState(false);
  const centerYRef = useRef(0);
  const radiusRef = useRef(RADIUS_CIRCLE);
  const lastSelectedRef = useRef(0);
  const angleGapRef = useRef(Math.PI * 2 / TOTAL);
  const baseOffsetRef = useRef(0);
  const isSpinningRef = useRef(false);
  const isHoveredRef = useRef(false);
  const hitboxRef = useRef();
  const prevSelectedCardIndexRef = useRef(selectedCardIndex);
  const isReturningRef = useRef(false);

  // Track the base angle offset for this card on the orbit ring.
  const orbitAngleRef = useRef((index / TOTAL) * Math.PI * 2);

  // Keep ref versions for useFrame
  const isClickedRef = useRef(isClicked);
  isClickedRef.current = isClicked;

  const isCircleReadyRef = useRef(isCircleReady);
  isCircleReadyRef.current = isCircleReady;

  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.anisotropy = 16;
    }
  }, [texture]);

  // Opening Fade-in: Opacity 0 -> 1 with random stagger delays on mount
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.opacity = 0;
      gsap.to(materialRef.current, {
        opacity: 1.0,
        duration: 1.0,
        delay: Math.random() * 0.4,
        ease: 'power2.out'
      });
    }
  }, []);

  // Transition: linear/scattered <-> circle
  useEffect(() => {
    // Hard reset card hover state on layout transition to prevent ghost hover states
    setCardHovered(false);

    if (!meshRef.current) return;

    // Reset orbit angle to the base position and initialize synchronization refs
    orbitAngleRef.current = (index / TOTAL) * Math.PI * 2;
    lastSelectedRef.current = 0;
    angleGapRef.current = Math.PI * 2 / TOTAL;
    baseOffsetRef.current = 0;
    isHoveredRef.current = false;

    let delay = 0;

    if (isClicked) {
      // Stagger: outer elements first (farthest from index 9.5)
      const distanceFromCenter = Math.abs(index - 9.5);
      delay = (9.5 - distanceFromCenter) * 0.032;

      const angle = orbitAngleRef.current;
      const posX = Math.sin(angle) * RADIUS_CIRCLE;
      const posY = Math.cos(angle) * RADIUS_CIRCLE;

      const isSelected = selectedCardIndex === index;
      const hasSelection = selectedCardIndex !== null;
      let targetScaleVal = 1.248;
      let targetZVal = index * 0.001;
      let targetOpacityVal = 1.0;

      if (hasSelection) {
        targetScaleVal = isSelected ? 10.0386 : 3.6;
        targetZVal = isSelected ? 10.0 : index * 0.001;

        let relIndex = index - selectedCardIndex;
        if (relIndex > TOTAL / 2) relIndex -= TOTAL;
        if (relIndex < -TOTAL / 2) relIndex += TOTAL;
        const distance = Math.abs(relIndex);

        if (distance > 3) {
          targetOpacityVal = 0.0;
        } else {
          targetOpacityVal = isSelected ? 1.0 : 0.25;
        }
      }

      gsap.to(meshRef.current.position, {
        x: posX,
        y: posY,
        z: targetZVal,
        duration: 1.1,
        delay,
        ease: 'back.out(1.5)',
        overwrite: 'auto',
        onComplete: () => {
          // If this is the last/farthest card to finish, trigger ready state
          if (index === 0 || index === TOTAL - 1) {
            setIsCircleReady(true);
          }
        }
      });

      // Explicitly transition scale to targetScaleVal during flight to ensure layout size consistency
      gsap.to(meshRef.current.scale, {
        x: targetScaleVal,
        y: targetScaleVal,
        z: targetScaleVal,
        duration: 1.1,
        delay,
        ease: 'power3.inOut',
        overwrite: 'auto'
      });

      if (materialRef.current) {
        gsap.to(materialRef.current, {
          opacity: targetOpacityVal,
          duration: 1.1,
          delay,
          ease: 'power3.inOut',
          overwrite: 'auto'
        });
      }
    } else {
      // Return to horizontal scattered layout
      setIsCircleReady(false);
      isHoverPaused.current = false; // Make sure it's resumed
      
      const distanceFromCenter = Math.abs(index - 9.5);
      delay = distanceFromCenter * 0.024;

      gsap.to(meshRef.current.position, {
        x: targetPosition[0],
        y: isHovered ? 0 : targetPosition[1],
        z: targetPosition[2],
        duration: 1.1,
        delay,
        ease: 'power3.inOut',
        overwrite: 'auto',
      });

      gsap.to(meshRef.current.scale, {
        x: 1.248,
        y: 1.248,
        z: 1.248,
        duration: 1.1,
        delay,
        ease: 'power3.inOut',
        overwrite: 'auto'
      });

      if (materialRef.current) {
        gsap.to(materialRef.current, {
          opacity: 1.0,
          duration: 1.1,
          delay,
          ease: 'power3.inOut',
          overwrite: 'auto'
        });
      }
    }

    // Always lock rotation flat on transition
    gsap.to(meshRef.current.rotation, {
      x: 0, y: 0, z: 0,
      duration: 0.4,
      overwrite: 'auto',
    });
  }, [isClicked]); // eslint-disable-line react-hooks/exhaustive-deps

  // Y-axis shift when hovered in list mode
  useEffect(() => {
    if (!meshRef.current || isClicked) return;
    gsap.to(meshRef.current.position, {
      x: targetPosition[0],
      y: isHovered ? 0 : targetPosition[1],
      z: targetPosition[2],
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, [isHovered]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hover Y-axis flip & scale up simultaneously (only triggers if isCircleReady is true)
  useEffect(() => {
    if (!meshRef.current) return;
    const isSelected = selectedCardIndex === index;
    const hasSelection = selectedCardIndex !== null;
    const wasSelected = prevSelectedCardIndexRef.current !== null;
    const isReturningFromSelection = wasSelected && !hasSelection;
    prevSelectedCardIndexRef.current = selectedCardIndex;

    if (isReturningFromSelection) {
      isReturningRef.current = true;
    }

    // Only apply selection/hover changes once the circle layout has formed
    if (!isCircleReady) return;

    // 1. Target Scale: default 1.248, hover 2.196 (20% scale reduction from 2.7456). In detail view: selected is 10.0386, non-selected is 3.6
    let targetScale = 1.248;
    if (hasSelection) {
      targetScale = isSelected ? 10.0386 : 3.6;
    } else {
      if (cardHovered) {
        targetScale = 2.196;
      }
    }

    // 2. Target Z position: protrude by +1.0 when hovered
    let baseZ = index * 0.001;
    if (isClicked) {
      if (hasSelection && isSelected) {
        baseZ = 10.0; // Pushed forward to 10.0 to separate depth and cover other cards completely
      }
    }
    let targetZ = baseZ;
    if (cardHovered) {
      targetZ = baseZ + 1.0; // Offset Z by +1.0 for hover Z-protrusion
    }

    // 3. Target Opacity: hide cards with relative index distance > 3 to prevent overlap
    let relIndex = index - selectedCardIndex;
    if (relIndex > TOTAL / 2) relIndex -= TOTAL;
    if (relIndex < -TOTAL / 2) relIndex += TOTAL;
    const distance = Math.abs(relIndex);

    let targetOpacity = 1.0;
    if (isClicked && hasSelection) {
      if (distance > 3) {
        targetOpacity = 0.0;
      } else {
        targetOpacity = isSelected ? 1.0 : 0.25;
      }
    }

    // Determine duration and ease
    let animDuration = 0.3;
    let animEase = 'power2.out';

    if (hasSelection) {
      animDuration = 0.8;
      animEase = 'power3.out';
    } else if (isReturningFromSelection) {
      animDuration = 0.8;
      animEase = 'power3.out';
    } else if (cardHovered) {
      animDuration = 0.35;
      animEase = 'power2.out';
    }

    // GSAP tween for scale, position.z, and material opacity
    gsap.to(meshRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: animDuration,
      ease: animEase,
      overwrite: 'auto'
    });

    gsap.to(meshRef.current.position, {
      z: targetZ,
      duration: animDuration,
      ease: animEase,
      overwrite: 'auto',
      onComplete: () => {
        if (isReturningFromSelection) {
          gsap.set(meshRef.current.rotation, { x: 0, y: 0, z: 0 });
          isReturningRef.current = false;
        }
      }
    });

    if (materialRef.current) {
      gsap.to(materialRef.current, {
        opacity: targetOpacity,
        duration: hasSelection ? 0.8 : 0.5,
        ease: hasSelection ? 'power3.out' : 'power2.out',
        overwrite: 'auto'
      });
    }

    // Y-rotation flip on hover (only triggers when not in detail view and not returning)
    if (cardHovered && !hasSelection && !isReturningRef.current) {
      isSpinningRef.current = true;
      gsap.to(meshRef.current.rotation, {
        y: '+=' + (Math.PI * 2), // Relative +360deg so every card always spins from its current angle
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => {
          if (meshRef.current) {
            meshRef.current.rotation.y = 0; // Reset Y-rotation to flat 0
            isSpinningRef.current = false;
          }
        }
      });
    } else {
      isHoverPaused.current = false;
      
      if (hasSelection) {
        isSpinningRef.current = false;
        // Instantly force rotation to 0 to kill the wind-up spin effect
        gsap.set(meshRef.current.rotation, { x: 0, y: 0 });
      } else {
        // Normalize rotation to prevent wind-up spin
        meshRef.current.rotation.x = meshRef.current.rotation.x % (Math.PI * 2);
        meshRef.current.rotation.y = meshRef.current.rotation.y % (Math.PI * 2);

        if (isReturningFromSelection) {
          gsap.killTweensOf(meshRef.current.rotation);
          gsap.set(meshRef.current.rotation, { x: 0, y: 0, z: 0 });
          isSpinningRef.current = false;
        } else {
          // Calculate the nearest target rotation (shortest path) to avoid backward spin loops
          const currentY = meshRef.current.rotation.y;
          const targetRotY = Math.round(currentY / (Math.PI * 2)) * (Math.PI * 2);
          const currentX = meshRef.current.rotation.x;
          const targetRotX = Math.round(currentX / (Math.PI * 2)) * (Math.PI * 2);

          gsap.to(meshRef.current.rotation, {
            x: targetRotX,
            y: targetRotY,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
            onComplete: () => {
              if (meshRef.current) {
                meshRef.current.rotation.y = 0;
                meshRef.current.rotation.x = 0;
                isSpinningRef.current = false;
              }
            }
          });
        }
      }
    }
  }, [cardHovered, selectedCardIndex, isCircleReady, isClicked]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ferris wheel orbit: only runs when circle transition has finished (isCircleReady is true)
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (!isClickedRef.current || !isCircleReadyRef.current) return;

    // 1. Instantly stop orbit rotation on hover without a single frame of delay
    if (isHoverPaused.current && selectedCardIndex === null && !isReturningRef.current) {
      // Sync Hitbox position/scale/rotation even when paused
      if (hitboxRef.current && meshRef.current) {
        hitboxRef.current.position.copy(meshRef.current.position);
        hitboxRef.current.rotation.z = meshRef.current.rotation.z;
        hitboxRef.current.scale.copy(meshRef.current.scale);
        hitboxRef.current.rotation.x = 0;
        hitboxRef.current.rotation.y = 0;
      }
      return;
    }

    // 2. Update refs based on selection state
    if (selectedCardIndex !== null) {
      lastSelectedRef.current = selectedCardIndex;
      // Snap baseOffset to 0 instantly to stop circle rotation immediately
      baseOffsetRef.current = 0;
      // Lerp angleGap to 0.55
      angleGapRef.current = THREE.MathUtils.lerp(angleGapRef.current, 0.55, 0.08);
    } else {
      // Advance baseOffset to create continuous rotation only if not hovered
      if (!isHoverPaused.current) {
        baseOffsetRef.current += delta * ORBIT_SPEED;
        // Keep baseOffset normalized to prevent infinity drift
        baseOffsetRef.current = Math.atan2(Math.sin(baseOffsetRef.current), Math.cos(baseOffsetRef.current));
      }
      // Lerp angleGap back to Math.PI * 2 / TOTAL
      angleGapRef.current = THREE.MathUtils.lerp(angleGapRef.current, Math.PI * 2 / TOTAL, 0.08);
    }

    // 3. Expand radius when selected: target is 6.0 (increased from 3.8), else RADIUS_CIRCLE (1.8)
    const targetRadius = (selectedCardIndex !== null) ? 6.0 : RADIUS_CIRCLE;
    radiusRef.current = THREE.MathUtils.lerp(radiusRef.current, targetRadius, 0.08);

    // 4. Center Shift Lerp: Y shifts down to -radius if selected, else 0 (to center selected card at y=0.45 to balance margins)
    const targetCenterY = (selectedCardIndex !== null) ? -radiusRef.current * 1.0 + 0.45 : 0;
    centerYRef.current = THREE.MathUtils.lerp(centerYRef.current, targetCenterY, 0.08);

    // 5. Align cards using the normalized relative index and base offset
    let relIndex = index - lastSelectedRef.current;
    if (relIndex > TOTAL / 2) relIndex -= TOTAL;
    if (relIndex < -TOTAL / 2) relIndex += TOTAL;

    // Defense guards for index wrapping values
    if (isNaN(relIndex) || !isFinite(relIndex)) {
      relIndex = 0;
    }

    let targetAngle = relIndex * angleGapRef.current + baseOffsetRef.current;
    targetAngle = targetAngle % (Math.PI * 2);
    let diff = targetAngle - orbitAngleRef.current;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff)); // Normalize to [-PI, PI] to prevent wrap-jump spins
    if (isNaN(diff) || !isFinite(diff)) diff = 0;

    orbitAngleRef.current += diff * 0.08; // smooth lerp to locked position

    // 6. Update coordinates with normalized angle and NaN defense guards
    let angle = orbitAngleRef.current;
    angle = Math.atan2(Math.sin(angle), Math.cos(angle));
    if (isNaN(angle) || !isFinite(angle)) {
      angle = (index / TOTAL) * Math.PI * 2;
    }
    orbitAngleRef.current = angle;

    meshRef.current.position.x = Math.sin(angle) * radiusRef.current;
    meshRef.current.position.y = Math.cos(angle) * radiusRef.current + centerYRef.current;

    // 7. Point outward along circle radius instantly if selected (aligned to angle), else return flat to 0
    if (selectedCardIndex !== null) {
      meshRef.current.rotation.z = -angle;
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.y = 0;
    } else {
      if (!isReturningRef.current) {
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.08);
        if (!isSpinningRef.current && !cardHovered) {
          meshRef.current.rotation.x = 0;
          meshRef.current.rotation.y = 0;
        }
      }
    }

    // 8. Sync Hitbox position/scale/rotation to match the visual mesh
    if (hitboxRef.current) {
      hitboxRef.current.position.copy(meshRef.current.position);
      hitboxRef.current.rotation.z = meshRef.current.rotation.z;
      hitboxRef.current.scale.copy(meshRef.current.scale);
      hitboxRef.current.rotation.x = 0;
      hitboxRef.current.rotation.y = 0;
    }
  });

  return (
    <group>
      {/* Invisible non-rotating Hitbox mesh to prevent Raycaster Jitter */}
      <mesh
        ref={hitboxRef}
        position={[targetPosition[0], targetPosition[1], targetPosition[2]]}
        rotation={[0, 0, 0]}
        scale={[1.248, 1.248, 1.248]}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!isCircleReady) return;
          isHoveredRef.current = true;
          isHoverPaused.current = true; // PAUSE infinite rotation immediately!
          setCardHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          if (!isCircleReady) return;
          isHoveredRef.current = false;
          isHoverPaused.current = false; // RESUME infinite rotation immediately!
          setCardHovered(false);

          if (selectedCardIndex === null) {
            gsap.to(meshRef.current.scale, {
              x: 1.248,
              y: 1.248,
              z: 1.248,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto'
            });
            gsap.to(meshRef.current.position, {
              z: index * 0.001,
              duration: 0.3,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        }}
        onClick={(e) => {
          console.log("3D Image Clicked!", index);
          e.stopPropagation();
          if (e.nativeEvent && e.nativeEvent.stopPropagation) {
            e.nativeEvent.stopPropagation();
          }
          // Always activate circle/arch view layout when a card is clicked
          setIsClicked(true);
          // Toggle selected card for arch view
          if (selectedCardIndex === index) {
            setSelectedCardIndex(null);
          } else {
            setSelectedCardIndex(index);
          }
        }}
      >
        <planeGeometry args={[0.36, 0.46]} /> {/* Slightly larger hitbox than visual geometry */}
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Visual Mesh */}
      <mesh
        ref={meshRef}
        position={[targetPosition[0], targetPosition[1], targetPosition[2]]}
        rotation={[0, 0, 0]}
        scale={[1.248, 1.248, 1.248]}
      >
        <planeGeometry args={[0.3, 0.4]} />
        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          toneMapped={false}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function Scene3D({ 
  isHovered, 
  isClicked, 
  setIsClicked,
  isCircleReady, 
  setIsCircleReady,
  selectedCardIndex,
  setSelectedCardIndex,
  onBackgroundClick
}) {
  // Shared hover paused stop switch ref
  const isHoverPaused = useRef(false);

  const cardsData = useMemo(() => {
    const spacing = 0.42;

    const groupA = [1.6, 1.87, 2.14, 2.41, 2.68];
    const groupB = [-2.68, -2.41, -2.14, -1.87, -1.6];
    const groupC = [0.3, 0.55, 0.8, 1.05, 1.3];
    const groupD = [-1.3, -1.05, -0.8, -0.55, -0.3];

    const shuffle = (arr, seedMultiplier) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const seed = Math.sin(i * seedMultiplier) * 10000;
        const j = Math.floor((seed - Math.floor(seed)) * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const shuffledA = shuffle(groupA, 12.83);
    const shuffledB = shuffle(groupB, 34.19);
    const shuffledC = shuffle(groupC, 56.41);
    const shuffledD = shuffle(groupD, 78.97);

    let idxA = 0, idxB = 0, idxC = 0, idxD = 0;

    return IMAGE_NUMBERS.map((num, i) => {
      const x = (i - 9.5) * spacing;
      let y;
      const pattern = i % 4;
      if (pattern === 0) y = shuffledA[idxA++];
      else if (pattern === 1) y = shuffledB[idxB++];
      else if (pattern === 2) y = shuffledC[idxC++];
      else y = shuffledD[idxD++];

      return {
        url: `/work-${num}.jpg`,
        position: [x, y, i * 0.001],
        index: i,
      };
    });
  }, []);

  const isSelected = selectedCardIndex !== null;

  return (
    <div className="canvas-container" style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'absolute', top: 0, left: 0, transform: 'translateY(5px)' }}>
      <Canvas
        orthographic
        camera={{ zoom: 230, position: [0, 0, 35], near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={onBackgroundClick}
      >
        {cardsData.map((card) => (
          <ImageCard
            key={card.index}
            url={card.url}
            targetPosition={card.position}
            index={card.index}
            isHovered={isHovered}
            isClicked={isClicked}
            isCircleReady={isCircleReady}
            setIsCircleReady={setIsCircleReady}
            isHoverPaused={isHoverPaused}
            selectedCardIndex={selectedCardIndex}
            setSelectedCardIndex={setSelectedCardIndex}
            setIsClicked={setIsClicked}
          />
        ))}

        {/* 'More to explore' button text layered below the selected card */}
        <Html
          position={[0, -1.56, 10.1]}
          center
          style={{
            opacity: isSelected ? 1 : 0,
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: 'translate3d(-50%, -50%, 0)',
            pointerEvents: 'none'
          }}
        >
          <button
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              fontFamily: "'Aeonik', sans-serif",
              fontSize: '20px',
              fontWeight: 600,
              color: '#444444',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              padding: '4px 8px',
              userSelect: 'none',
              letterSpacing: '-0.03em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: isSelected ? 'auto' : 'none',
              transform: 'translateY(65px)'
            }}
            onClick={(e) => {
              e.stopPropagation();
              const numStr = String((selectedCardIndex % 20) + 1).padStart(2, '0');
              window.location.hash = '#/detail/work-' + numStr;
            }}
          >
            <span style={{ textDecoration: 'underline' }}>More to explore</span>
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ marginLeft: '10px', display: 'inline-block' }}
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </Html>
      </Canvas>
    </div>
  );
}
