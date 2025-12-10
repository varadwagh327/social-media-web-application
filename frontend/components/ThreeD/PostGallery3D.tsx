'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface Post3DProps {
  posts: any[];
  onPostSelect?: (postId: string) => void;
}

export function PostGallery3D({ posts, onPostSelect }: Post3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!containerRef.current || posts.length === 0) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 15;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create post cards as 3D objects
    const cards: THREE.Mesh[] = [];
    const cardCount = Math.min(posts.length, 15);

    for (let i = 0; i < cardCount; i++) {
      const geometry = new THREE.BoxGeometry(4, 5, 0.2);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / cardCount, 0.7, 0.6),
        shininess: 100,
      });

      const card = new THREE.Mesh(geometry, material);

      // Position cards in a spiral
      const angle = (i / cardCount) * Math.PI * 4;
      const radius = 8 + (i / cardCount) * 3;
      card.position.x = Math.cos(angle) * radius;
      card.position.y = (i / cardCount - 0.5) * 10;
      card.position.z = Math.sin(angle) * radius;

      card.rotation.y = angle + Math.PI / 2;
      card.userData.originalRotation = { ...card.rotation };
      card.userData.postIndex = i;

      scene.add(card);
      cards.push(card);
    }

    // Create a central rotating sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(2, 4);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      wireframe: true,
      emissive: 0x1e40af,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate sphere
      sphere.rotation.x += 0.002;
      sphere.rotation.y += 0.003;

      // Animate cards
      cards.forEach((card, index) => {
        card.rotation.x += 0.001;
        card.rotation.y += 0.002;

        // Mouse tracking effect
        card.position.x += (mouseX * 2 - card.position.x) * 0.02;
        card.position.y += (mouseY * 2 - card.position.y) * 0.02;

        // Hover effect
        const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        if (distance < 0.3) {
          card.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
        } else {
          card.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    setIsInitialized(true);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      cards.forEach(card => {
        card.geometry.dispose();
        (card.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [posts]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-96 rounded-lg overflow-hidden bg-slate-900"
    >
      <div ref={containerRef} className="w-full h-full" />
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      )}
    </motion.div>
  );
}
