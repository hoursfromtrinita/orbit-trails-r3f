import * as THREE from "three";
import React, { useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Bloom, EffectComposer, DepthOfField } from "@react-three/postprocessing";

function IcoSpherePoints({ index }) {
  const ref = React.useRef();
  const offset = index * 0.01;
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
    let light = index * 0.015;
    let { r, g, b } = col.setHSL(0, 0, light);
    colors.push(r, g, b);
  }

  const colorsBuffer = new Float32Array(colors);
  const sprite = useLoader(THREE.TextureLoader, "./circle.png");
  const size = index * 0.0010;
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
  for (let i = 0; i < 40; i += 1) {
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
      cameraRef.current.position.x = Math.sin(time * 0.1) * 1.5;
      cameraRef.current.position.y = Math.cos(time * 0.1) * 1.5;
    }
  });

  return (
    <PerspectiveCamera 
      ref={cameraRef}
      makeDefault 
      position={[0, 0, 12]} // Zoomed position
      fov={40} // Narrower field of view for more focused look
    />
  );
}

function App() {
  return (
    <Canvas gl={{ toneMapping: THREE.NoToneMapping }}>
      <CameraController />
      <EffectComposer>
        <DepthOfField 
          focusDistance={0.015} 
          focalLength={0.2} 
          bokehScale={6} 
        />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
      <PointsGroup />
      <hemisphereLight args={[0xffffff, 0x000000, 1.0]} />
      {/* <primitive object={bgSprites} /> */}
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

export default App;
