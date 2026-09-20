import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeDViewer({ modelUrl, floors = 4, buildingType = "Commercial Complex" }) {
  const mountRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [engineLabel, setEngineLabel] = useState("Blender 3D Native Engine");

  const materialsRef = useRef([]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 600;
    const height = currentMount.clientHeight || 420;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b132b); // Dark navy slate background

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const targetY = (floors * 3.5) / 2;
    camera.position.set(40, 30, 50);
    camera.lookAt(0, targetY, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    currentMount.innerHTML = '';
    currentMount.appendChild(renderer.domElement);

    // 2. Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(50, 80, 50);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.8); // Cyan fill light
    fillLight.position.set(-40, 30, -40);
    scene.add(fillLight);

    // 3. Ground & Grid
    const grid = new THREE.GridHelper(100, 40, 0x38bdf8, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);

    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    // 4. Main Building Group
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    materialsRef.current = [];

    // Helper to create and track materials
    const createMaterial = (params) => {
      const mat = new THREE.MeshStandardMaterial({ ...params, wireframe });
      materialsRef.current.push(mat);
      return mat;
    };

    // If modelUrl (OBJ file) is provided, attempt OBJ parsing
    let isObjLoaded = false;
    if (modelUrl) {
      fetch(modelUrl)
        .then((res) => {
          if (res.ok) return res.text();
          throw new Error("Could not load OBJ");
        })
        .then((objText) => {
          const lines = objText.split('\n');
          const vertices = [];
          const faces = [];

          for (let line of lines) {
            line = line.trim();
            if (line.startsWith('v ')) {
              const parts = line.split(/\s+/).slice(1).map(Number);
              vertices.push(new THREE.Vector3(parts[0], parts[1], parts[2]));
            } else if (line.startsWith('f ')) {
              const parts = line.split(/\s+/).slice(1).map((p) => parseInt(p.split('/')[0]) - 1);
              if (parts.length >= 3) {
                faces.push([parts[0], parts[1], parts[2]]);
                if (parts.length === 4) {
                  faces.push([parts[0], parts[2], parts[3]]);
                }
              }
            }
          }

          if (vertices.length > 0 && faces.length > 0) {
            const geometry = new THREE.BufferGeometry();
            const posArray = [];
            for (const [i1, i2, i3] of faces) {
              if (vertices[i1] && vertices[i2] && vertices[i3]) {
                posArray.push(vertices[i1].x, vertices[i1].y, vertices[i1].z);
                posArray.push(vertices[i2].x, vertices[i2].y, vertices[i2].z);
                posArray.push(vertices[i3].x, vertices[i3].y, vertices[i3].z);
              }
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(posArray, 3));
            geometry.computeVertexNormals();

            const objMat = createMaterial({ color: 0x0284c7, metalness: 0.3, roughness: 0.4 });
            const objMesh = new THREE.Mesh(geometry, objMat);
            objMesh.castShadow = true;
            objMesh.receiveShadow = true;
            buildingGroup.add(objMesh);
            isObjLoaded = true;
            setEngineLabel("Blender 3D Native Wavefront Engine");
          }
        })
        .catch(() => {
          // OBJ fetch failed, fallback to procedural rendering
        });
    }

    // Procedural Building Construction (Renders high-visibility architectural structure)
    const floorH = 3.5;
    const widthSpan = 24;
    const depthSpan = 16;

    // Base Foundation
    const fndGeo = new THREE.BoxGeometry(widthSpan + 4, 0.8, depthSpan + 4);
    const fndMat = createMaterial({ color: 0x334155, roughness: 0.7 });
    const fnd = new THREE.Mesh(fndGeo, fndMat);
    fnd.position.set(0, 0.4, 0);
    buildingGroup.add(fnd);

    // Multi-Story Framing
    for (let f = 0; f < floors; f++) {
      const yBase = 0.8 + f * floorH;
      const yCenter = yBase + (floorH - 0.4) / 2;

      // Concrete Floor Slab
      const slabGeo = new THREE.BoxGeometry(widthSpan, 0.4, depthSpan);
      const slabMat = createMaterial({ color: 0x475569, metalness: 0.2, roughness: 0.5 });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.set(0, yBase + floorH - 0.2, 0);
      slab.castShadow = true;
      buildingGroup.add(slab);

      // Glass Curtain Facade
      const glassGeo = new THREE.BoxGeometry(widthSpan - 0.6, floorH - 0.4, depthSpan - 0.6);
      const glassMat = createMaterial({
        color: 0x0284c7,
        metalness: 0.4,
        roughness: 0.2,
        transparent: true,
        opacity: 0.75
      });
      const glass = new THREE.Mesh(glassGeo, glassMat);
      glass.position.set(0, yCenter, 0);
      buildingGroup.add(glass);

      // Corner Pillars
      const pillarGeo = new THREE.BoxGeometry(0.8, floorH - 0.4, 0.8);
      const pillarMat = createMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3 });
      const offsets = [
        [-widthSpan / 2 + 0.5, -depthSpan / 2 + 0.5],
        [widthSpan / 2 - 0.5, -depthSpan / 2 + 0.5],
        [-widthSpan / 2 + 0.5, depthSpan / 2 - 0.5],
        [widthSpan / 2 - 0.5, depthSpan / 2 - 0.5]
      ];
      offsets.forEach(([px, pz]) => {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(px, yCenter, pz);
        pillar.castShadow = true;
        buildingGroup.add(pillar);
      });
    }

    // Rooftop Structure
    const roofY = 0.8 + floors * floorH;
    const roofDeckGeo = new THREE.BoxGeometry(10, 2.2, 8);
    const roofMat = createMaterial({ color: 0x1e293b, roughness: 0.4 });
    const roofDeck = new THREE.Mesh(roofDeckGeo, roofMat);
    roofDeck.position.set(0, roofY + 1.1, 0);
    roofDeck.castShadow = true;
    buildingGroup.add(roofDeck);

    // 5. Mouse Interaction & Orbit Control Logic
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let angleY = 0.6;
    let angleX = 0.35;
    let distance = 55;

    const updateCameraPos = () => {
      camera.position.x = distance * Math.sin(angleY) * Math.cos(angleX);
      camera.position.y = distance * Math.sin(angleX) + targetY;
      camera.position.z = distance * Math.cos(angleY) * Math.cos(angleX);
      camera.lookAt(0, targetY, 0);
    };

    updateCameraPos();

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMousePos.x;
      const dy = e.clientY - prevMousePos.y;

      angleY += dx * 0.008;
      angleX += dy * 0.008;
      angleX = Math.max(0.08, Math.min(Math.PI / 2.3, angleX));

      prevMousePos = { x: e.clientX, y: e.clientY };
      updateCameraPos();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      distance += e.deltaY * 0.05;
      distance = Math.max(20, Math.min(110, distance));
      updateCameraPos();
    };

    const elem = renderer.domElement;
    elem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    elem.addEventListener('wheel', onWheel, { passive: false });

    // 6. Animation Loop
    let animId;
    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      if (autoRotate && !isDragging) {
        angleY += 0.004;
        updateCameraPos();
      }
      renderer.render(scene, camera);
    };

    renderLoop();

    // 7. Resize Handler
    const onResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      elem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      elem.removeEventListener('wheel', onWheel);
      if (currentMount) currentMount.innerHTML = '';
    };
  }, [floors, buildingType, modelUrl]);

  // Handle Wireframe Toggle
  useEffect(() => {
    materialsRef.current.forEach((mat) => {
      if (mat) mat.wireframe = wireframe;
    });
  }, [wireframe]);

  return (
    <div className="relative w-full h-[420px] bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Overlay Badge */}
      <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg z-10">
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{engineLabel}</span>
        <span className="text-[10px] text-sky-400 bg-slate-800 px-2 py-0.5 rounded font-mono uppercase">
          {floors} Floors | {buildingType}
        </span>
      </div>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-900/90 backdrop-blur border border-slate-700 p-2 rounded-lg text-xs text-slate-200 z-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1 rounded text-xs font-bold transition ${
              autoRotate ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {autoRotate ? '⏸ Auto-Rotate' : '▶ Play Rotation'}
          </button>
          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1 rounded text-xs font-bold transition ${
              wireframe ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {wireframe ? '📐 Solid Mode' : '🕸 Wireframe Mesh'}
          </button>
        </div>

        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
          🖱 Drag Mouse to Rotate • Scroll to Zoom
        </span>
      </div>
    </div>
  );
}
