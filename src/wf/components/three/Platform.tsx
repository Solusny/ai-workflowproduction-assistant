import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Glow } from './glow'
import { pearl, tintGloss } from './materials'

const PULSES = 3
const PULSE_PERIOD = 3.6

/** Layered glossy tech platform with glowing ring lines and rings that pulse outward. */
export function Platform() {
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([])
  const coreGlow = useRef<THREE.Sprite>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    pulseRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const k = ((t / PULSE_PERIOD + i / PULSES) % 1 + 1) % 1
      const s = 1.35 + k * 2.4
      mesh.scale.set(s, s, s)
      ;(mesh.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.55
    })
    if (coreGlow.current) {
      const p = 0.5 + 0.5 * Math.sin(t * 2)
      coreGlow.current.scale.set(2.4 + p * 0.3, 2.4 + p * 0.3, 1)
    }
  })

  return (
    <group>
      {/* Faint floor disc for the circuit traces */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <circleGeometry args={[4.4, 96]} />
        <meshBasicMaterial color="#FFEFE9" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
        <ringGeometry args={[4.36, 4.4, 128]} />
        <meshBasicMaterial color="#FFD3C2" transparent opacity={0.9} />
      </mesh>

      {/* Base tier */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.4, 2.48, 0.2, 96]} />
        <meshPhysicalMaterial {...pearl} />
      </mesh>
      {/* Mid tier */}
      <mesh position={[0, 0.27, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.9, 1.95, 0.14, 96]} />
        <meshPhysicalMaterial {...tintGloss} />
      </mesh>
      {/* Top tier */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.4, 0.12, 96]} />
        <meshPhysicalMaterial {...pearl} />
      </mesh>

      {/* Glowing ring lines on each tier edge */}
      {[
        { r: 2.4, y: 0.205 },
        { r: 1.9, y: 0.345 },
        { r: 1.35, y: 0.465 },
        { r: 2.12, y: 0.205 },
      ].map(({ r, y }, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
          <ringGeometry args={[r - (i === 3 ? 0.008 : 0.025), r, 160]} />
          <meshBasicMaterial color={i === 3 ? '#FFD3C2' : '#FF8A5C'} toneMapped={false} />
        </mesh>
      ))}

      {/* Bright glowing disc under the robot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.468, 0]}>
        <circleGeometry args={[0.95, 64]} />
        <meshBasicMaterial color="#FFEFE9" toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.47, 0]}>
        <ringGeometry args={[0.6, 0.95, 64]} />
        <meshBasicMaterial color="#FFD3C2" transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <Glow spriteRef={coreGlow} position={[0, 0.6, 0]} scale={2.4} color="#FFD3C2" opacity={0.75} />

      {/* Outward pulses */}
      {Array.from({ length: PULSES }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            pulseRefs.current[i] = m
          }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, 0]}
        >
          <ringGeometry args={[0.98, 1, 128]} />
          <meshBasicMaterial color="#FF8A5C" transparent opacity={0.4} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}
