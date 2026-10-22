/**
 * Mutable, render-loop friendly state shared between the GSAP scroll timeline (DOM)
 * and the React Three Fiber hub scene. Mutated directly to avoid React re-renders per frame.
 */
export const hubState = {
  /** Scrubbed hero scroll progress, 0 → 1 across the five milestones. */
  progress: 0,
  /** True once the visitor has started scrolling through the pinned hero. */
  engaged: false,
  /** Current camera azimuth (radians), written by the camera rig. */
  camAz: 0.38,
  /** Feature index currently at the front of the ring. */
  front: 0,
  /** Feature index under the pointer, or -1. */
  hovered: -1,
  /** Page-wide pointer position, normalised to -1 → 1. */
  pointer: { x: 0, y: 0 },
}

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      hubState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      hubState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    },
    { passive: true },
  )
}

export const MILESTONES = 5
/** Continuous milestone position, 0 → 4. */
export const milestonePosition = () => hubState.progress * (MILESTONES - 1)
export const activeIndex = () =>
  hubState.engaged ? Math.min(MILESTONES - 1, Math.round(milestonePosition())) : hubState.front
