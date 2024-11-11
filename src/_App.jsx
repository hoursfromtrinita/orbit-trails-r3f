import * as THREE from "three";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import getLayer from "./getLayer";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { AfterimagePass } from "./fx/postprocessing/AfterimagePass.js";

const bgSprites = getLayer({
  numSprites: 8,
  radius: 10,
  z: -10.5,
  size: 24,
  opacity: 0.2,
  path: "./rad-grad.png",
});

const afterImagePass = new AfterimagePass();
afterImagePass.uniforms["damp"].value = 0.975;

function IcoSpherePoints() {
  const ref = React.useRef();

  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  const icoGeo = new THREE.IcosahedronGeometry(2, 4);
  const colors = [];
  let col;
  const icoVerts = icoGeo.attributes.position;
  const p = new THREE.Vector3();
  for (let i = 0; i < icoVerts.count; i += 1) {
    p.fromBufferAttribute(icoVerts, i);
    let hue = 0.3 + p.x * 0.125;
    col = new THREE.Color().setHSL(hue, 1.0, 0.5);
    colors.push(col.r, col.g, col.b);
  }
  const colorsBuffer = new Float32Array(colors);
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
      <pointsMaterial vertexColors size={0.05} />
    </points>
  );
}

function App() {
  return (
    <Canvas gl={{ toneMapping: THREE.NoToneMapping }} >
      <EffectComposer>
        {/* <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} /> */}
        <primitive object={afterImagePass} />
      </EffectComposer>
      <IcoSpherePoints />
      <hemisphereLight args={[0xffffff, 0x000000, 1.0]} />
      {/* <primitive object={bgSprites} /> */}
      
      <OrbitControls />
    </Canvas>
  );
}

export default App;
