import * as THREE from 'three'

let glowTexture: THREE.CanvasTexture | null = null

/** Soft radial falloff texture generated once at runtime (no network assets). */
export function getGlowTexture() {
  if (glowTexture) return glowTexture
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.3, 'rgba(255,255,255,0.5)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  glowTexture = new THREE.CanvasTexture(canvas)
  glowTexture.colorSpace = THREE.SRGBColorSpace
  return glowTexture
}

interface GlowProps {
  color?: string
  scale?: number | [number, number, number]
  opacity?: number
  position?: [number, number, number]
  spriteRef?: React.Ref<THREE.Sprite>
}

/** Camera-facing soft glow used instead of full-screen bloom so it reads well on a light background. */
export function Glow({ color = '#FF8A5C', scale = 1, opacity = 0.6, position, spriteRef }: GlowProps) {
  const s: [number, number, number] = typeof scale === 'number' ? [scale, scale, scale] : scale
  return (
    <sprite ref={spriteRef} position={position} scale={s} renderOrder={2}>
      <spriteMaterial map={getGlowTexture()} color={color} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </sprite>
  )
}
