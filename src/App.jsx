import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Bloom, EffectComposer, DepthOfField } from "@react-three/postprocessing";

// This component controls the focus point for depth of field
function FocusPoint() {
  const { camera } = useThree();
  const focusRef = useRef();
  
  // Position at the center of the sphere
  useFrame(() => {
    if (focusRef.current) {
      focusRef.current.position.set(0, 0, 0);
    }
  });
  
  return <mesh ref={focusRef} visible={false} />;
}

function IcoSpherePoints({ index }) {
  const ref = React.useRef();
  const offset = index * 0.005; // Reduced offset for smoother rotation
  let elapsedTime = 0;
  useFrame((_, dTime) => {
    elapsedTime += dTime * 0.2;
    ref.current.rotation.x = elapsedTime + offset;
    ref.current.rotation.y = elapsedTime + offset;
  });

  const icoGeo = new THREE.IcosahedronGeometry(2, 4);
  const colors = [];
  let col = new THREE.Color();
  const icoVerts = icoGeo.attributes.position;
  const p = new THREE.Vector3();
  for (let i = 0; i < icoVerts.count; i += 1) {
    p.fromBufferAttribute(icoVerts, i);
    // Pure white color
    colors.push(1, 1, 1);
  }

  const colorsBuffer = new Float32Array(colors);
  const sprite = useLoader(THREE.TextureLoader, "./circle.png");
  // Make points bigger
  const size = index * 0.0012 * 1.5;
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={icoVerts.count}
          array={icoVerts.array}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={icoVerts.count}
          array={colorsBuffer}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        vertexColors 
        size={size} 
        map={sprite}
        alphaTest={0.5}
        transparent={true}
      />
    </points>
  );
}

function PointsGroup() {
  const children = [];
  // Increased to 60 points from 40
  for (let i = 0; i < 60; i += 1) {
    children.push(<IcoSpherePoints index={i} key={i}/>)
  }
  return (
    <group>
      {children}
    </group>
  );
}

function CameraController() {
  const cameraRef = useRef();
  
  // Animate camera position
  useFrame((state, delta) => {
    if (cameraRef.current) {
      // Create subtle camera movement
      const time = state.clock.getElapsedTime();
      cameraRef.current.position.x = Math.sin(time * 0.1) * 1.2;
      cameraRef.current.position.y = Math.cos(time * 0.1) * 1.2;
    }
  });

  return (
    <PerspectiveCamera 
      ref={cameraRef}
      makeDefault 
      position={[0, 0, 6]} // Adjusted zoom position
      fov={45} // Adjusted field of view
    />
  );
}

function App() {
  // Create a fog color - BLACK
  const fogColor = new THREE.Color(0, 0, 0);

  return (
    <Canvas 
      gl={{ toneMapping: THREE.NoToneMapping }} 
      camera={{ position: [0, 0, 6], fov: 45 }}
      linear
    >
      <CameraController />
      <EffectComposer>
        <DepthOfField 
          focusDistance={0} 
          focalLength={0.02} 
          bokehScale={2} 
          height={480} 
        />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={1.5} />
      </EffectComposer>
      
      {/* Apply fog with near=3, far=8 to contain it within the sphere */}
      <fog attach="fog" args={[fogColor, 3, 8]} />
      <color attach="background" args={[0x000000]} />
      
      <FocusPoint />
      <PointsGroup />
      <hemisphereLight args={[0xffffff, 0x000000, 1.0]} />
      <OrbitControls 
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        enableZoom={false} 
        enablePan={false}
      />
    </Canvas>
  );
}

export default App;
