import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { hubState } from '../../lib/hubState'

const ARCS = [
  { r: 1.55, arc: Math.PI * 0.95, speed: 0.12, tilt: 0.1, y: 1.9, opacity: 0.45 },
  { r: 1.85, arc: Math.PI * 0.6, speed: -0.08, tilt: -0.15, y: 1.8, opacity: 0.32 },
  { r: 2.15, arc: Math.PI * 0.4, speed: 0.06, tilt: 0.2, y: 1.7, opacity: 0.25 },
]

const PANELS = [
  { pos: [-1.35, 2.25, -0.55], rot: 0.35, size: [0.8, 0.52] },
  { pos: [1.4, 2.05, -0.6], rot: -0.35, size: [0.66, 0.44] },
  { pos: [0.05, 2.95, -0.9], rot: 0, size: [1.05, 0.34] },
] as const

/** Semi-transparent holographic arcs and glass panels behind the robot (always on the far side from the camera). */
export function Holograms() {
  const group = useRef<THREE.Group>(null)
  const arcRefs = useRef<(THREE.Mesh | null)[]>([])
  const panelRefs = useRef<(THREE.Group | null)[]>([])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (group.current) group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, hubState.camAz, 3, dt)
    arcRefs.current.forEach((m, i) => {
      if (!m) return
      m.rotation.z += ARCS[i].speed * dt * 2
      const flicker = 0.85 + 0.15 * Math.sin(t * 11 + i * 3) * Math.sin(t * 3.7 + i)
      ;(m.material as THREE.MeshBasicMaterial).opacity = ARCS[i].opacity * flicker
    })
    panelRefs.current.forEach((g, i) => {
      if (!g) return
      g.position.y = PANELS[i].pos[1] + Math.sin(t * 0.9 + i * 2) * 0.06
      const flicker = Math.sin(t * 17 + i * 5) > 0.97 ? 0.4 : 1
      g.children.forEach((c) => {
        const mat = (c as THREE.Mesh).material as THREE.MeshBasicMaterial & { userData: { base?: number } }
        if (mat.userData.base === undefined) mat.userData.base = mat.opacity
        mat.opacity = mat.userData.base * flicker
      })
    })
  })

  return (
    <group ref={group}>
      {ARCS.map((a, i) => (
        <mesh
          key={i}
          ref={(m) => {
            arcRefs.current[i] = m
          }}
          position={[0, a.y, -0.75 - i * 0.12]}
          rotation={[a.tilt, 0, i]}
        >
          <torusGeometry args={[a.r, 0.014 + i * 0.004, 8, 120, a.arc]} />
          <meshBasicMaterial color={i === 0 ? '#FF8A5C' : '#FFD3C2'} transparent opacity={a.opacity} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
      {PANELS.map((p, i) => (
        <group
          key={i}
          ref={(g) => {
            panelRefs.current[i] = g
          }}
          position={p.pos as unknown as [number, number, number]}
          rotation={[0, p.rot, 0]}
        >
          <mesh>
            <planeGeometry args={[p.size[0], p.size[1]]} />
            <meshBasicMaterial color="#FFD3C2" transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Panel UI lines */}
          {[0.12, 0, -0.1].map((y, j) => (
            <mesh key={j} position={[-p.size[0] * 0.12 + j * 0.03, y * (p.size[1] / 0.5), 0.002]}>
              <planeGeometry args={[p.size[0] * (0.6 - j * 0.12), 0.025]} />
              <meshBasicMaterial color="#FF8A5C" transparent opacity={0.5} depthWrite={false} toneMapped={false} />
            </mesh>
          ))}
          <mesh position={[0, p.size[1] / 2, 0.002]}>
            <planeGeometry args={[p.size[0], 0.012]} />
            <meshBasicMaterial color="#FF8A5C" transparent opacity={0.7} depthWrite={false} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
