// TESTING - THIS VERSION SHOULD SHOW RED PARTICLES
console.log("App.jsx is loading - this should show white particles");

import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

// This component controls the focus point for depth of field
function FocusPoint() {
  const { camera } = useThree();
  const focusRef = useRef();
  
  // Position slightly in front of the sphere's center
  useFrame(() => {
    if (focusRef.current) {
      // Position the focus point at sphere center
      focusRef.current.position.set(0, 0, 0);
    }
  });
  
  return <mesh ref={focusRef} visible={false} />;
}

function IcoSpherePoints({ index }) {
  const ref = React.useRef();
  const offset = index * 0.005;
  let elapsedTime = 0;
  useFrame((_, dTime) => {
    elapsedTime += dTime * 0.2;
    ref.current.rotation.x = elapsedTime + offset;
    ref.current.rotation.y = elapsedTime + offset;
  });

  const icoGeo = new THREE.IcosahedronGeometry(2, 4);
  const colors = [];
  const icoVerts = icoGeo.attributes.position;
  const p = new THREE.Vector3();
  
  for (let i = 0; i < icoVerts.count; i += 1) {
    p.fromBufferAttribute(icoVerts, i);
    colors.push(1, 1, 1); // White color
  }

  const colorsBuffer = new Float32Array(colors);
  const sprite = useLoader(THREE.TextureLoader, "./circle.png");
  // 50% smaller particles
  const size = index * 0.0006 * 1.5;
  
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
  for (let i = 0; i < 60; i += 1) {
    children.push(<IcoSpherePoints index={i} key={i}/>)
  }
  return (
    <group>
      {children}
    </group>
  );
}

// Replacing with camera settings from reference repo
function CameraController() {
  // No camera controller in reference repo - removing
  return null;
}

function App() {
  // Create a fog color - BLACK
  const fogColor = new THREE.Color(0, 0, 0);

  return (
    <Canvas 
      gl={{ toneMapping: THREE.NoToneMapping }} 
      camera={{ position: [0, 0, 8], fov: 45 }}
      linear
    >
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
      <fog attach="fog" args={[fogColor, 3, 12]} />
      <color attach="background" args={[0x000000]} />
      
      <FocusPoint />
      <PointsGroup />
      <hemisphereLight args={[0xffffff, 0x000000, 1.0]} />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}

export default App;
