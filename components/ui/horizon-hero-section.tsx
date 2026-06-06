"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

gsap.registerPlugin(ScrollTrigger);

export function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [section, setSection] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050606, 0.0004);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 30, 300);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.58;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.75, 0.36, 0.86));

    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(4200 * 3);
    const colors = new Float32Array(4200 * 3);
    for (let i = 0; i < 4200; i += 1) {
      const radius = 220 + Math.random() * 860;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      const color = new THREE.Color().setHSL(Math.random() > 0.86 ? 0.32 : 0, Math.random() > 0.86 ? 0.85 : 0, 0.74 + Math.random() * 0.26);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ size: 1.4, vertexColors: true, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending }),
    );
    scene.add(stars);

    const mountainMaterial = new THREE.MeshBasicMaterial({ color: 0x07101f, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
    const mountainShape = new THREE.Shape([
      new THREE.Vector2(-560, -140),
      new THREE.Vector2(-360, -40),
      new THREE.Vector2(-180, -90),
      new THREE.Vector2(0, -24),
      new THREE.Vector2(190, -82),
      new THREE.Vector2(380, -36),
      new THREE.Vector2(560, -140),
    ]);
    const mountains = new THREE.Mesh(new THREE.ShapeGeometry(mountainShape), mountainMaterial);
    mountains.position.set(0, -120, -90);
    scene.add(mountains);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      stars.rotation.z = time * 0.018;
      mountains.position.x = Math.sin(time * 0.2) * 8;
      camera.lookAt(0, 0, -480);
      composer.render();
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight || 1;
      const progress = Math.min(window.scrollY / max, 1);
      setScrollProgress(progress);
      setSection(Math.round(progress * 2));
      camera.position.z = 300 - progress * 760;
      camera.position.y = 30 + progress * 28;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      starGeometry.dispose();
      mountainMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    gsap.from([menuRef.current, titleRef.current, subtitleRef.current, progressRef.current], {
      autoAlpha: 0,
      y: 36,
      duration: 1.1,
      stagger: 0.12,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="hero-container cosmos-style">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div ref={menuRef} className="side-menu">
        <div className="menu-icon"><span /><span /><span /></div>
        <div className="vertical-text">RUN CULTURE</div>
      </div>
      <div className="hero-content cosmos-content">
        <h1 ref={titleRef} className="hero-title">7K WORLD</h1>
        <div ref={subtitleRef} className="hero-subtitle cosmos-subtitle">
          <p className="subtitle-line">Where running becomes identity,</p>
          <p className="subtitle-line">and every club drop becomes culture.</p>
        </div>
      </div>
      <div ref={progressRef} className="scroll-progress">
        <div className="scroll-text">SCROLL</div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${scrollProgress * 100}%` }} /></div>
        <div className="section-counter">{String(section).padStart(2, "0")} / 02</div>
      </div>
    </div>
  );
}

export default Component;
