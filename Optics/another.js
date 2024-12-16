import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import 'aframe';

extend({ OrbitControls });

const GUIControls = ({ beamradius, setBeamradius, snap, setSnap }) => {
  useEffect(() => {
    const gui = new dat.GUI();

    gui.add({ laser_radius: beamradius }, 'laser_radius', 0.1, 0.3).name('Beam radius').onChange(setBeamradius);
    gui.add({ snap_to_grid: snap }, 'snap_to_grid').name('Snap to grid').onChange(setSnap);

    return () => gui.destroy();
  }, [beamradius, snap, setBeamradius, setSnap]);

  return null;
};

const Laser = () => {
  const laserRef = useRef();

  useEffect(() => {
    const laser = new THREE.Object3D();
    laser.position.set(-0.5, 0, 25);
    laserRef.current.add(laser);
  }, []);

  return <group ref={laserRef}></group>;
};

const Scene = ({ beamradius, snap }) => {
  const { camera, gl } = useThree();
  const sceneRef = useRef();

  useEffect(() => {
    camera.position.set(65 * Math.sin(1.3) * Math.cos(-0.2), 65 * Math.cos(1.3), 65 * Math.sin(1.3) * Math.sin(-0.2));
    camera.lookAt(0, 0, 0);

    const resizeRenderer = () => {
      gl.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', resizeRenderer);
    return () => window.removeEventListener('resize', resizeRenderer);
  }, [camera, gl]);

  return (
    <scene ref={sceneRef} background={new THREE.Color(0xdeb887)}>
      <ambientLight intensity={0.5} />
      <Laser />
      <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[100, 100]} />
        <meshStandardMaterial color="brown" />
      </mesh>
    </scene>
  );
};

const App = () => {
  const [beamradius, setBeamradius] = useState(0.25);
  const [snap, setSnap] = useState(true);

  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, overflow: 'hidden' }}>
      <Canvas camera={{ fov: 27, near: 0.1, far: 200 }}>
        <OrbitControls />
        <Scene beamradius={beamradius} snap={snap} />
      </Canvas>
      <GUIControls beamradius={beamradius} setBeamradius={setBeamradius} snap={snap} setSnap={setSnap} />
      <div style={{ position: 'fixed', top: 10, left: 10, zIndex: 2 }}>
        <button style={{ backgroundColor: 'red' }}>Drag objects</button>
        <button style={{ backgroundColor: '#4863a0' }}>Adjust post height</button>
        <button style={{ backgroundColor: '#4863a0' }}>Rotate postholder</button>
        <button style={{ backgroundColor: '#4863a0' }}>Tilt mirror</button>
      </div>
    </div>
  );
};

export default App;
