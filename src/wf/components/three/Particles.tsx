import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 70
const COLORS = ['#FFD3C2', '#FF8A5C', '#FFD3C2', '#FF3700']

/** Sparse instanced peach/coral particles drifting upward. */
export function Particles() {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, () => {
        const r = 1.2 + Math.random() * 4.2
        const a = Math.random() * Math.PI * 2
        return { x: Math.sin(a) * r, z: Math.cos(a) * r, y: Math.random() * 5, speed: 0.12 + Math.random() * 0.3, size: 0.02 + Math.random() * 0.035, phase: Math.random() * 6 }
      }),
    [],
  )

  useLayoutEffect(() => {
    const c = new THREE.Color()
    seeds.forEach((_, i) => mesh.current?.setColorAt(i, c.set(COLORS[i % COLORS.length])))
    if (mesh.current?.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [seeds])

  useFrame((state, dt) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    seeds.forEach((s, i) => {
      s.y += s.speed * dt
      if (s.y > 5.2) s.y = 0
      const fade = Math.sin((s.y / 5.2) * Math.PI)
      dummy.position.set(s.x + Math.sin(t * 0.6 + s.phase) * 0.15, s.y, s.z)
      dummy.scale.setScalar(s.size * (0.4 + fade))
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} frustumCulled={false} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.75} toneMapped={false} depthWrite={false} />
    </instancedMesh>
  )
}
