// Chapter 1: Official Scene
// Three.js scene setup for chapter 1 - "L'officina"

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useStoryScene } from '@/stories/narrative'

export function useChapter1Scene(containerRef) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0e1114)

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 2, 5) // Preset position per chapter 1

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))

  if (containerRef.current) {
    containerRef.current.appendChild(renderer.domElement)
  }

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.damping = 0.1
  controls.enableDamping = true

  // Load chapter-specific model with Draco
  useStoryScene(scene, 'chapter-1', {
    onLoad: (model) => {
      model.position.set(0, 0, 0)
      scene.add(model)
    },
    onError: (err) => {
      console.error('Chapter 1 model load error:', err)
    }
  })

  // Reduced motion handling
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reducedMotion) {
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
  }

  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }

  animate()

  return { renderer, scene, camera, controls, reducedMotion }
}