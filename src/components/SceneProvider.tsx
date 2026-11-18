// Scene Provider Component
// Provides the Three.js scene context for the petito website.
// Wraps the WorkshopToolsBackground and provides base scene functions
// to child components via context.

import React, { createContext, useContext, useEffect, useState } from 'react'
import * as THREE from 'three'
// @ts-ignore - Three.js OrbitControls module types
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { createRenderer, createCamera, createScene, createLights } from '@/components/ThreeBaseScene'

// **Scene Context**
// Context that holds the Three.js scene state, accessible by any child component.
// Provides the renderer, camera, scene, controls, and reduced motion preference.

type SceneContextType = {
  renderer: THREE.WebGLRenderer | null
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera | null
  controls: OrbitControls | null
  isReducedMotion: boolean
}

const SceneContext = createContext<SceneContextType | undefined>(undefined)

// **Use Scene Context Hook**
// Returns the Three.js scene context from the nearest SceneProvider.
// Throws if used outside of a SceneProvider wrapper.

export function useScene() {
  const context = useContext(SceneContext)
  if (!context) {
    throw new Error('useScene must be used within a SceneProvider')
  }
  return context
}

// **SceneProvider Component**
// Wraps the children with Three.js scene setup.
// - Creates renderer, camera, scene, and lights
// - Sets up OrbitControls with mouse interaction
// - Respects prefers-reduced-motion preference
// - Provides context to all child components

type SceneProviderProps = {
  children: React.ReactNode
  initialChapter?: 'chapter-1' | 'chapter-2' | 'chapter-3'
}

export function SceneProvider({ children, initialChapter }: SceneProviderProps) {
  // **Reduced Motion Preference**
  // Checks if the user has reduced motion enabled in system settings.
  const [isReducedMotion, setIsReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  // **Renderer Setup**
  // Creates the WebGL renderer with antialias and transparent background.
  // Pixel ratio is capped at 1.8 for performance across devices.
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null)
  useEffect(() => {
    const r = createRenderer()
    setRenderer(r)
    return () => {
      r.dispose()
    }
  }, [])

  // **Camera Setup**
  // Creates perspective camera at base position (0, 2, 5).
  // Aspect ratio is dynamically updated on window resize.
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null)
  useEffect(() => {
    const cam = createCamera()
    setCamera(cam)
    // Setup resize handler to update camera aspect ratio
    const handleResize = () => {
      if (cam) {
        cam.aspect = window.innerWidth / window.innerHeight
        cam.updateProjectionMatrix()
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // **Scene Setup**
  // Creates the scene with fog for depth perception.
  const [scene, setScene] = useState<THREE.Scene>(createScene)

  // **Lights Setup**
  // Adds balanced lighting: ambient + directional + warm/cool point lights.
  const [lights, setLights] = useState<THREE.Group>(createLights)

  // **Controls Setup**
  // OrbitControls with damping for smooth mouse-driven camera orbit.
  // Auto-rotation is disabled when user has reduced motion enabled.
  const [controls, setControls] = useState<OrbitControls | null>(null)
  useEffect(() => {
    if (!renderer?.domElement || !camera) return

    const ctrl = new OrbitControls(camera, renderer.domElement)
    ctrl.damping = 0.1
    ctrl.enableDamping = true
    // Respect reduced motion preference - disable auto-rotate if enabled
    if (isReducedMotion) {
      ctrl.autoRotate = false
    } else {
      ctrl.autoRotate = true
      ctrl.autoRotateSpeed = 2
    }
    setControls(ctrl)
  }, [camera, renderer, isReducedMotion])

  // **Chapter-Based Camera Positioning**
  // Updates camera position based on the current chapter.
  // Each chapter has preset camera positions for optimal viewing.
  useEffect(() => {
    const chapterConfigs: Record<
      NonNullable<SceneProviderProps['initialChapter']>,
      { pos: [number, number, number]; target: [number, number, number] }
    > = {
      'chapter-1': { pos: [0, 2, 5], target: [0, 0, 0] },
      'chapter-2': { pos: [5, 3, 8], target: [0, 0, 0] },
      'chapter-3': { pos: [-3, 4, 10], target: [0, 0, 0] },
    }

    const config = initialChapter ? chapterConfigs[initialChapter] : undefined
    if (config && camera) {
      camera.position.set(...config.pos)
      camera.lookAt(...config.target)
      camera.updateProjectionMatrix()
    }
  }, [initialChapter, camera])

  // **Reduced Motion Listener**
  // Updates the reduced motion preference when the user changes system settings.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
      if (controls) {
        controls.autoRotate = !e.matches
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return (
    <SceneContext.Provider value={{
      renderer,
      scene,
      camera,
      controls,
      isReducedMotion,
    }}>
      {children}
    </SceneContext.Provider>
  )
}

// **Use Scene Hook Hook**
// Convenient hook for accessing the scene context in functional components.
// Returns all the Three.js scene state and control functions.

export function useSceneHook() {
  const context = useContext(SceneContext)
  if (!context) {
    throw new Error('useSceneHook must be used within a SceneProvider')
  }
  return context
}

// **Export Types**
// Exports the Three.js types and scene context type for use in other files.

export type { SceneContextType }

// **Default Export**
// The SceneProvider component is also exported as default for convenience.

export default SceneProvider