// Chapter Loader Component
// Main component that handles chapter navigation, lazy loading, and crossfade transitions

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
// @ts-ignore - Three.js examples module types
import OrbitControls from 'three/examples/jsm/controls/OrbitControls'
import { usePrefersReducedMotion } from '@/hooks/useUiPreferences'

type ChapterKey = 'chapter-1' | 'chapter-2' | 'chapter-3'

type ChapterProps = {
  initialChapter?: ChapterKey
  onChapterChange?: (chapter: ChapterKey) => void
}

export function ChapterLoader({ initialChapter = 'chapter-1' as ChapterKey, onChapterChange }: ChapterProps) {
  const reduced = usePrefersReducedMotion()
  const [currentChapter, setCurrentChapter] = useState<ChapterKey>(initialChapter)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize chapter scene
  useEffect(() => {
    if (!containerRef.current) return

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.setClearColor(0x0e1114, 1)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    containerRef.current.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    
    // Camera preset positions per chapter
    const chapterCameraPositions: Record<ChapterKey, [number, number, number]> = {
      'chapter-1': [0, 2, 5],
      'chapter-2': [5, 3, 8],
      'chapter-3': [-3, 4, 10]
    }
    
    const pos = chapterCameraPositions[currentChapter]
    if (pos) {
      camera.position.set(...pos)
    } else {
      camera.position.set(0, 2, 5)
    }
    camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.damping = 0.1
    controls.enableDamping = true

    // Respect reduced motion preference
    if (reduced) {
      controls.autoRotate = false
    }

    // Set up chapter-specific configuration
    const chapterConfigs: Record<ChapterKey, { title: string; description: string }> = {
      'chapter-1': { title: 'L\'Officina', description: 'Benvenuti nel nostro centro di assistenza meccanica' },
      'chapter-2': { title: 'I Nostri Servizi', description: 'Manutenzione, riparazione e diagnosi elettroniche' },
      'chapter-3': { title: 'Perché Sceglierci', description: 'Competenza, trasparenza e tempi rispettati' }
    }
    
    const config = chapterConfigs[currentChapter]
    if (config) {
      // Dispatch event for UI update
      const event = new CustomEvent('story:chapter:change', {
        detail: { chapter: currentChapter, config }
      })
      document.dispatchEvent(event)
    }

    // Animation loop
    let animationId = 0
    
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [reduced])

  // Handle history API state changes from browser back/forward
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as { chapter?: ChapterKey } | null
      if (state?.chapter) {
        setCurrentChapter(state.chapter)
        onChapterChange?.(state.chapter)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Navigation functions
  const nextChapter = () => {
    const chapters: ChapterKey[] = ['chapter-1', 'chapter-2', 'chapter-3']
    const currentIndex = chapters.indexOf(currentChapter)
    if (currentIndex < chapters.length - 1) {
      const nextChapter = chapters[currentIndex + 1]
      setCurrentChapter(nextChapter)
      onChapterChange?.(nextChapter)
      // Update browser history
      history.pushState({ chapter: nextChapter }, '', `/story/${nextChapter}`)
    }
  }

  const prevChapter = () => {
    const chapters: ChapterKey[] = ['chapter-1', 'chapter-2', 'chapter-3']
    const currentIndex = chapters.indexOf(currentChapter)
    if (currentIndex > 0) {
      const prevChapter = chapters[currentIndex - 1]
      setCurrentChapter(prevChapter)
      onChapterChange?.(prevChapter)
      // Update browser history
      history.pushState({ chapter: prevChapter }, '', `/story/${prevChapter}`)
    }
  }

  // Chapter navigation state
  const prevDisabled = currentChapter === 'chapter-1'
  const nextDisabled = currentChapter === 'chapter-3'

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div 
        className="story-chapter"
        data-chapter={currentChapter}
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        <div className="story-content" style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Three.js renderer content injected by useEffect */}
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 30, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between',
        margin: '0 20px', pointerEvents: reduced ? 'none' : 'auto'
      }}>
        <button
          onClick={prevChapter}
          disabled={prevDisabled}
          style={{
            background: 'rgba(17, 19, 21, 0.8)', color: 'white', border: 'none',
            padding: '10px 20px', borderRadius: '4px', cursor: 'pointer',
            fontFamily: '"Manrope", sans-serif', marginRight: '10px'
          }}
          aria-label="Capitolo precedente"
        >
          Indietro
        </button>
        <button
          onClick={nextChapter}
          disabled={nextDisabled}
          style={{
            background: 'rgba(17, 19, 21, 0.8)', color: 'white', border: 'none',
            padding: '10px 20px', borderRadius: '4px', cursor: 'pointer',
            fontFamily: '"Manrope", sans-serif'
          }}
          aria-label="Capitolo successivo"
        >
          Avanti
        </button>
      </div>
    </div>
  )
}

// Chapter configuration exports
export const chapterConfigs = {
  'chapter-1': { title: 'L\'Officina', description: 'Benvenuti nel nostro centro di assistenza meccanica' },
  'chapter-2': { title: 'I Nostri Servizi', description: 'Manutenzione, riparazione e diagnosi elettroniche' },
  'chapter-3': { title: 'Perché Sceglierci', description: 'Competenza, trasparenza e tempi rispettati' }
}

export const chapterCameraPositions = {
  'chapter-1': [0, 2, 5],
  'chapter-2': [5, 3, 8],
  'chapter-3': [-3, 4, 10]
}