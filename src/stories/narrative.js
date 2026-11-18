// Story Scene Narrative Manager
// Handles chapter loading, crossfade transitions, and lazy loading

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import DRACOLoader from 'three/examples/jsm/loaders/DRACOLoader'
import { usePrefersReducedMotion } from '@/hooks/useUiPreferences'

// Chapter configurations with camera positions
const chapterConfigs = {
  'chapter-1': {
    cameraPosition: [0, 2, 5],
    cameraTarget: [0, 0, 0],
    title: 'L\'Officina',
    description: 'Benvenuti nel nostro centro di assistenza meccanica'
  },
  'chapter-2': {
    cameraPosition: [5, 3, 8],
    cameraTarget: [0, 0, 0],
    title: 'I Nostri Servizi',
    description: 'Manutenzione, riparazione e diagnosi elettroniche'
  },
  'chapter-3': {
    cameraPosition: [-3, 4, 10],
    cameraTarget: [0, 0, 0],
    title: 'Perché Sceglierci',
    description: 'Competenza, trasparenza e tempi rispettati'
  }
}

let currentChapter = null
let currentLoader = null
let crossfadeTl = null

export function useStoryScene(scene, chapterKey, options = {}) {
  const reduced = usePrefersReducedMotion()
  const config = chapterConfigs[chapterKey]

  if (!config) {
    console.error(`Chapter ${chapterKey} not configured`)
    return null
  }

  // Set up camera if not already
  if (!options.camera) {
    options.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    options.camera.position.set(...config.cameraPosition)
  }

  // Set camera target
  options.camera.lookAt(...config.cameraTarget)

  // Load GLTF with Draco compression
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/threejs/draco/')
  
  const gltfLoader = new GLTFLoader()
  gltfLoader.setDRACOLoader(dracoLoader.setDecoderPath('/threejs/draco/'))

  const loadPromise = new Promise((resolve, reject) => {
    gltfLoader.load(
      `/stories/models/${chapterKey}.glb`,
      (gltf) => {
        const model = gltf.scene
        model.name = chapterKey
        scene.add(model)
        
        // Apply chapter-specific scaling/positioning
        if (chapterKey === 'chapter-1') {
          model.scale.set(1, 1, 1)
          model.position.set(0, -0.5, 0)
        }
        
        if (options.onLoad) options.onLoad(model)
        resolve(model)
      },
      (xhr) => {
        if (options.onProgress) options.onProgress(xhr)
      },
      (error) => {
        console.error('Model load error for', chapterKey, error)
        if (options.onError) options.onError(error)
        reject(error)
      }
    )
  })

  // Crossfade transition management
  if (currentChapter && currentChapter !== chapterKey) {
    // Start crossfade out of current chapter
    if (crossfadeTl) crossfadeTl.kill()
    
    crossfadeTl = new TimelineLite()
    crossfadeTl.to(scene.children.filter(c => c !== currentLoader), {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.in'
    })
    
    // Load new chapter after fade out
    crossfadeTl.call(() => {
      scene.remove(currentLoader)
      currentLoader.visible = false
    })
    
    crossfadeTl.call(() => {
      loadPromise.then((newModel) => {
        currentLoader = newModel
        newModel.visible = true
        newModel.opacity = 0
        scene.add(newModel)
        
        // Fade in new chapter
        const tl = new TimelineLite()
        tl.to(newModel, { opacity: 1, duration: 0.8, ease: 'power2.out' })
        
        if (options.onChapterLoad) options.onChapterLoad(newModel)
      })
    })
  } else {
    // First chapter or same chapter - just load
    loadPromise.then((model) => {
      currentLoader = model
      if (options.onChapterLoad) options.onChapterLoad(model)
    })
  }

  return {
    scene,
    camera: options.camera,
    chapterKey,
    config,
    reduced,
    reload: () => useStoryScene(scene, chapterKey, options)
  }
}

export function navigateToChapter(chapterKey, containerRef) {
  // Update browser history
  history.pushState({ chapter: chapterKey }, '', `/story/${chapterKey}`)
  
  // Load new chapter with crossfade
  useStoryScene(containerRef.current ? containerRef.current : document.body, chapterKey, {
    onChapterLoad: (model) => {
      // Dispatch event for UI updates
      const event = new CustomEvent('story:chapter:change', {
        detail: { chapter: chapterKey, model }
      })
      document.dispatchEvent(event)
    }
  })
}

// Handle history API state changes
window.addEventListener('popstate', (event) => {
  const chapter = event.state?.chapter
  if (chapter && chapterConfigs[chapter]) {
    navigateToChapter(chapter)
  }
})

// Handle reduced motion preference changes
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
reducedMotionQuery.addEventListener('change', (e) => {
  // Disable auto-rotation on reduced motion
  if (currentChapter && chapterConfigs[currentChapter]) {
    const scene = document.querySelector(`[data-chapter="${currentChapter}"]`)
    if (scene) {
      const controls = scene?.three?.controls
      if (controls) {
        controls.autoRotate = !e.matches
      }
    }
  }
})