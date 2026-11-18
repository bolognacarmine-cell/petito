// Chapter 1 Camera Presets
// Predefined camera positions and animations for each chapter

import * as THREE from 'three'

export const chapterCameraPresets = {
  'chapter-1': {
    position: new THREE.Vector3(0, 2, 5),
    target: new THREE.Vector3(0, 0, 0),
    fov: 75,
    description: 'Panoramica dell\'officina principale'
  },
  'chapter-2': {
    position: new THREE.Vector3(5, 3, 8),
    target: new THREE.Vector3(0, 0, 0),
    fov: 70,
    description: 'Visuale completa dei servizi offerti'
  },
  'chapter-3': {
    position: new THREE.Vector3(-3, 4, 10),
    target: new THREE.Vector3(0, 0, 0),
    fov: 65,
    description: 'Angolo prospettico per il modello'
  }
}

export function setupChapterCamera(camera, chapterKey) {
  const preset = chapterCameraPresets[chapterKey]
  if (!preset) return

  camera.fov = preset.fov
  camera.position.set(...preset.position.toArray())
  camera.lookAt(...preset.target.toArray())
  camera.updateProjectionMatrix()
}

export function animateChapterCamera(camera, chapterKey, duration = 1.5) {
  const preset = chapterCameraPresets[chapterKey]
  if (!preset) return Promise.resolve()

  return new Promise((resolve) => {
    const startPos = camera.position.clone()
    const startTime = performance.now()
    
    const animate = () => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      
      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3)
      
      camera.position.lerpVectors(startPos, preset.position, eased)
      camera.lookAt(preset.target.x, preset.target.y, preset.target.z)
      camera.updateProjectionMatrix()
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        resolve()
      }
    }
    
    animate()
  })
}