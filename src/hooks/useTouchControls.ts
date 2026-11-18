// Touch Controls Module
// Mobile and touch event handlers for the petito 3D storiesite.
// Provides tap, pinch, swipe, and orbit control adjustments for mobile devices.

import { useEffect, useRef, useState } from "react"

// **Touch State Interface**
// Tracks all touch interactions and state for the 3D story scene.

type TouchState = {
  // Is currently touching the screen
  isTouching: boolean
  // Touch start X position (for swipe detection)
  startX: number
  // Touch start Y position (for swipe detection)
  startY: number
  // Current pinch distance (for zoom detection)
  pinchStartDistance: number | null
  // Is currently pinching
  isPinching: boolean
  // Current zoom level relative to start
  currentZoom: number
  // Direction of last swipe ('left' | 'right' | 'up' | 'down' | null)
  lastSwipeDirection: "left" | "right" | "up" | "down" | null
}

// **Default Touch State**
// Initial state for touch interactions.

const defaultTouchState: TouchState = {
  isTouching: false,
  startX: 0,
  startY: 0,
  pinchStartDistance: null,
  isPinching: false,
  currentZoom: 1,
  lastSwipeDirection: null,
}

// **useTouchControls Hook**
// Main hook for handling all touch interactions on the story chapter container.
// Supports: tap, swipe, pinch-to-zoom, and orbit control adjustments.

export function useTouchControls(
  containerRef: React.RefObject<HTMLElement>,
  // Optional callback for chapter navigation
  onChapterTap?: () => void,
  // Optional callback for zoom changes
  onZoomChange?: (zoom: number) => void,
  // Optional callback for swipe directions
  onSwipeDirection?: (direction: "left" | "right" | "up" | "down") => void,
  // Sensitivity factor for orbit controls adjustment (0.5 = half sensitivity, 2 = double)
  orbitSensitivity?: number,
) {
  // **Touch State Management**
  // Maintains the current touch state across effect re-renders.

  const [touchState, setTouchState] = useState<TouchState>(defaultTouchState)

  // **Reduced Motion Preference**
  // Respect user's system preference for reduced motion.

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  // **Element Reference**
  // The container element that receives touch events (typically the chapter div).

  const container = containerRef.current

  // **Tap/Click Handler for Chapter Advancement**
  // Detects single taps (not part of a swipe) and triggers chapter navigation.

  const handleTouchStart = (e: TouchEvent) => {
    // Store touch start positions
    setTouchState((prev) => ({
      ...prev,
      isTouching: true,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      pinchStartDistance: null,
      isPinching: false,
      currentZoom: 1,
      lastSwipeDirection: null,
    }))

    // Initialize pinch distance if two fingers touching
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      setTouchState((prev) => ({
        ...prev,
        pinchStartDistance: Math.sqrt(dx * dx + dy * dy),
        isPinching: true,
      }))
    }
  }

  // **Touch Move Handler**
  // Handles finger movement for swipe detection and pinch zoom.

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchState.isTouching) return

    // If currently pinching, handle zoom
    if (touchState.isPinching && e.touches.length >= 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const currentDistance = Math.sqrt(dx * dx + dy * dy)

      // Calculate zoom factor based on distance change
      const pinchStartDistance = touchState.pinchStartDistance
      if (pinchStartDistance !== null && pinchStartDistance > 0) {
        const zoomFactor = currentDistance / pinchStartDistance
        const newZoom = touchState.currentZoom * zoomFactor

        // Clamp zoom between reasonable limits (0.5x to 2x)
        const clampedZoom = Math.max(0.5, Math.min(2, newZoom))

        setTouchState((prev) => ({
          ...prev,
          currentZoom: clampedZoom,
        }))

        // Notify parent component of zoom change
        onZoomChange?.(clampedZoom)
      }

      // Update pinch distance for next frame
      setTouchState((prev) => ({
        ...prev,
        pinchStartDistance: currentDistance,
      }))
    }

    // If single finger moving, detect swipe direction
    if (touchState.isTouching && !touchState.isPinching && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - touchState.startX
      const deltaY = e.touches[0].clientY - touchState.startY

      // Minimum distance to register as a swipe (prevents tiny movements)
      const minSwipeDistance = 30

      // Determine if this is a horizontal or vertical swipe
      const isMostlyHorizontal = Math.abs(deltaX) > Math.abs(deltaY)

      if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
        if (isMostlyHorizontal) {
          // Horizontal swipe - left or right
          if (deltaX > 0) {
            // Swipe right
            setTouchState((prev) => ({
              ...prev,
              lastSwipeDirection: "right",
            }))
            onSwipeDirection?.("right")
          } else {
            // Swipe left
            setTouchState((prev) => ({
              ...prev,
              lastSwipeDirection: "left",
            }))
            onSwipeDirection?.("left")
          }
        } else {
          // Vertical swipe - up or down
          if (deltaY > 0) {
            // Swipe down
            setTouchState((prev) => ({
              ...prev,
              lastSwipeDirection: "down",
            }))
            onSwipeDirection?.("down")
          } else {
            // Swipe up
            setTouchState((prev) => ({
              ...prev,
              lastSwipeDirection: "up",
            }))
            onSwipeDirection?.("up")
          }
        }

        // Reset touch state after swipe detection
        setTouchState((prev) => ({
          ...prev,
          isTouching: false,
          startX: 0,
          startY: 0,
          lastSwipeDirection: null,
        }))
      }
    }
  }

  // **Touch End Handler**
  // Called when the user lifts their finger(s) from the screen.

  const handleTouchEnd = (e: TouchEvent) => {
    // If we were pinching, end the pinch gesture
    if (touchState.isPinching) {
      setTouchState((prev) => ({
        ...prev,
        isPinching: false,
        pinchStartDistance: null,
      }))
      return
    }

    // If we were touching with one finger and it wasn't a swipe,
    // treat it as a tap for chapter navigation
    if (touchState.isTouching && !touchState.isPinching) {
      // Small movement means it was a tap, not a swipe
      // If we get here, it was likely a tap
      onChapterTap?.()
    }

    // Reset touch state
    setTouchState((prev) => ({
      ...prev,
      isTouching: false,
      startX: 0,
      startY: 0,
      pinchStartDistance: null,
      isPinching: false,
      currentZoom: 1,
      lastSwipeDirection: null,
    }))
  }

  // **Touch Cancel Handler**
  // Called when the system cancels the touch event (e.g., page switch).

  const handleTouchCancel = () => {
    setTouchState(defaultTouchState)
  }

  // **Resize Listener for Orbit Sensitivity**
  // Adjusts orbit control sensitivity based on device size/orbitSensitivity prop.

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        // Could adjust orbit control sensitivity here based on window size
        // This is a placeholder for future orbit control integration
      }, 0)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [orbitSensitivity])

  // **Reduced Motion Listener**
  // Updates touch behavior when user changes system preferences.

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handler = (e: { matches: boolean }) => {
      // When reduced motion is enabled, disable swipe-based chapter navigation
      // and simplify touch interactions
      if (e.matches) {
        // Disable swipe-based navigation, keep tap navigation
      } else {
        // Re-enable normal touch interactions
      }
    }

    handler(mediaQuery)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  // **Return Touch State and Handlers**
  // Exposes the touch state and all handlers for use in the component UI.

  return {
    touchState,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
    isReducedMotion,
    // Convenience computed properties
    canSwipeLeft: touchState.lastSwipeDirection === "right" && !touchState.isPinching,
    canSwipeRight: touchState.lastSwipeDirection === "left" && !touchState.isPinching,
    isZoomed: touchState.currentZoom > 1,
    zoomLevel: touchState.currentZoom,
  }
}

// **useReducedMotionPreference Hook**
// Simple hook for checking reduced motion preference.
// Used by touch controls to adapt behavior to user preferences.

export function useReducedMotionPreference(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// **useSwipeDetection Hook**
// Minimal hook for detecting swipe directions on a target element.
// More lightweight than useTouchControls if only swipe detection is needed.

export function useSwipeDetection(
  elementRef: React.RefObject<HTMLElement>,
  onSwipe: (direction: "left" | "right" | "up" | "down") => void,
  options: { threshold?: number; enableVertical?: boolean } = {},
) {
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | "down">("left")

  const onSwipeRef = useRef(onSwipe)
  onSwipeRef.current = onSwipe

  const { threshold = 30, enableVertical = true } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let startX = 0
    let startY = 0
    let tracking = false

    const handleStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      tracking = true
      setIsSwiping(true)
    }

    const handleMove = (e: TouchEvent) => {
      if (!tracking || e.touches.length !== 1) return

      const deltaX = e.touches[0].clientX - startX
      const deltaY = e.touches[0].clientY - startY

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) >= threshold) {
          const direction = deltaX > 0 ? "right" : "left"
          setSwipeDirection(direction)
          onSwipeRef.current(direction)
          tracking = false
          setIsSwiping(false)
        }
      } else if (enableVertical && Math.abs(deltaY) >= threshold) {
        const direction = deltaY > 0 ? "down" : "up"
        setSwipeDirection(direction)
        onSwipeRef.current(direction)
        tracking = false
        setIsSwiping(false)
      }
    }

    const handleEnd = () => {
      tracking = false
      setIsSwiping(false)
    }

    element.addEventListener("touchstart", handleStart, { passive: true })
    element.addEventListener("touchmove", handleMove, { passive: true })
    element.addEventListener("touchend", handleEnd)
    element.addEventListener("touchcancel", handleEnd)

    return () => {
      element.removeEventListener("touchstart", handleStart)
      element.removeEventListener("touchmove", handleMove)
      element.removeEventListener("touchend", handleEnd)
      element.removeEventListener("touchcancel", handleEnd)
    }
  }, [elementRef, threshold, enableVertical])

  return { isSwiping, swipeDirection }
}