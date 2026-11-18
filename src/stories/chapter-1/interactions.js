// Chapter 1 Interactions
// Touch/click handlers, model interactions, navigation

import { useStoryScene } from '@/stories/narrative'

export function useChapter1Interactions(containerRef, onChapterChange) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Tap/click per avanzamento capitolo
  const handleChapterTap = (e) => {
    if (reduced) {
      // Su dispositivi con reduced motion, vai al prossimo capitolo
      // ma senza animazioni camera complesse
      const current = document.querySelector('.active-chapter')
      if (current) {
        const next = current.nextElementSibling
        if (next && next.classList.contains('chapter')) {
          navigateToChapter(next.dataset.chapter)
        }
      }
    }
  }

  // Event listeners per il container chapter
  if (containerRef.current) {
    containerRef.current.addEventListener('click', handleChapterTap)
    
    // Swipe left/right per navigazione orizzontale
    let startX = 0
    let isSwiping = false

    containerRef.current.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX
      isSwiping = true
    })

    containerRef.current.addEventListener('touchend', (e) => {
      if (!isSwiping) return
      const endX = e.changedTouches[0].clientX
      const diff = startX - endX

      // Swipe right (positive diff) -> next chapter
      if (diff > 50 && isSwiping) {
        const current = document.querySelector('.active-chapter')
        if (current) {
          const next = current.nextElementSibling
          if (next && next.classList.contains('chapter')) {
            navigateToChapter(next.dataset.chapter)
          }
        }
      }
      // Swipe left (negative diff) -> prev chapter
      else if (diff < -50 && isSwiping) {
        const current = document.querySelector('.active-chapter')
        if (current) {
          const prev = current.previousElementSibling
          if (prev && prev.classList.contains('chapter')) {
            navigateToChapter(prev.dataset.chapter)
          }
        }
      }
      isSwiping = false
    })
  }

  // Pinch-to-zoom per ingrandimento modello
  let pinchStartDist = 0
  let lastZoom = 1

  if (containerRef.current) {
    containerRef.current.addEventListener('pointerdown', (e) => {
      if (e.touches && e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        pinchStartDist = Math.sqrt(dx * dx + dy * dy)
      }
    })

    containerRef.current.addEventListener('pointermove', (e) => {
      if (e.touches && e.touches.length === 2 && pinchStartDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const currentDist = Math.sqrt(dx * dx + dy * dy)
        const scaleFactor = currentDist / pinchStartDist
        
        // Apply zoom al modello 3D
        const model = containerRef.current.querySelector('.story-model')
        if (model) {
          model.style.transform = `scale(${lastZoom * scaleFactor})`
        }
        
        lastZoom *= scaleFactor
        pinchStartDist = currentDist
      }
    })
  }

  // Sensitivity adjustment per orbital controls touch
  const handleTouchMove = (e) => {
    e.preventDefault() // Prevenire scroll della pagina durante touch orbit
  }

  containerRef.current.addEventListener('touchmove', handleTouchMove, { passive: false })

  return {
    handleChapterTap,
    navigateToChapter: (chapter) => useStoryScene(containerRef, chapter),
    setReducedMotion: (value) => { reduced = value.matches }
  }
}