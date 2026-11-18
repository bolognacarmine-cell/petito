// Base Three.js Scene
// Foundation scene for the petito Car Service website
// Provides the core rendering infrastructure that enhanced features build upon

import * as THREE from 'three'

// **Renderer Configuration**
// Creates a WebGL renderer with antialiasing for smooth curves,
// sets the pixel ratio to cap at 1.8 for performance, and
// sets a clear color with full transparency (0 alpha)
export function createRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
  renderer.setClearColor(0x0e1114, 0) // Dark nearly-black with full transparency
  return renderer
}

// **PerspectiveCamera Configuration**
// Camera positioned at (0, 2, 5) looking at the origin
// Field of view: 75 degrees for a natural perspective
// Aspect ratio: dynamically set on window resize
export function createCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 2, 5) // Base position - can be overridden per chapter
  camera.lookAt(0, 0, 0)
  return camera
}

// **Scene Configuration**
// Creates a Three.js scene with fog for depth perception
// Fog color matches the background, starts at 10 units, fades by 30 units
export function createScene(): THREE.Scene {
  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x0e1114, 10, 30)
  return scene
}

// **Lights Configuration**
// Adds balanced lighting to the scene:
// - Ambient light for overall illumination
// - Directional light as the main "key" light
// - Point lights for accent lighting (warm and cool tones)
export function createLights(): THREE.Group {
  const lightsGroup = new THREE.Group()

  // Ambient light - soft overall illumination
  const ambientLight = new THREE.AmbientLight(0xffecd6, 0.8)
  lightsGroup.add(ambientLight)

  // Main directional light - simulates sunlight/primary light source
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2)
  keyLight.position.set(6, 8, 6)
  lightsGroup.add(keyLight)

  // Fill light - softens shadows
  const fillLight = new THREE.DirectionalLight(0xcfe3ff, 1.0)
  fillLight.position.set(-5, 3, 4)
  lightsGroup.add(fillLight)

  // Warm accent light - adds color warmth
  const warmLight = new THREE.PointLight(0xff9a4a, 28, 45)
  warmLight.position.set(4, 2, 8)
  lightsGroup.add(warmLight)

  // Cool accent light - adds color contrast
  const coolLight = new THREE.PointLight(0x8fd0ff, 14, 40)
  coolLight.position.set(-6, -1, 6)
  lightsGroup.add(coolLight)

  return lightsGroup
}

// **Reduced Motion Handler**
// Checks if the user has prefers-reduced-motion enabled in system settings
// Returns true if the user has reduced motion enabled, false otherwise
export function useReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// **Resize Handler Setup**
// Updates camera aspect ratio and renderer size when window resizes
// Also updates OrbitControls to maintain proper interaction
export function setupResizeHandler(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
): () => void {
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}

// **Animation Loop**
// Starts the main render loop that updates controls and renders the scene
// Returns a function to cancel the animation frame
export function startAnimationLoop(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
): () => void {
  let animationId = 0

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }

  animate()

  return () => {
    cancelAnimationFrame(animationId)
  }
}

// **Export all core utilities**
export type { THREE }