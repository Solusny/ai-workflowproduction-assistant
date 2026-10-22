import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { hubState, activeIndex } from '../../lib/hubState'
import { Glow } from './glow'
import { pearl } from './materials'

const STEP = (Math.PI * 2) / 5
const damp = THREE.MathUtils.damp

/** Shortest-path angular damping. */
function dampAngle(current: number, target: number, lambda: number, dt: number) {
  let delta = (target - current) % (Math.PI * 2)
  if (delta > Math.PI) delta -= Math.PI * 2
  if (delta < -Math.PI) delta += Math.PI * 2
  return damp(current, current + delta, lambda, dt)
}

/** Procedural friendly AI robot: pearl body, glass visor, blinking eyes, floating hands, pulsing antenna. */
export function Robot({ ringRef }: { ringRef: React.RefObject<THREE.Group | null> }) {
  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const eyes = useRef<THREE.Group>(null)
  const leftHand = useRef<THREE.Group>(null)
  const rightHand = useRef<THREE.Group>(null)
  const antennaTip = useRef<THREE.Mesh>(null)
  const antennaGlow = useRef<THREE.Sprite>(null)
  const nextBlink = useRef(2)

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (!root.current || !head.current) return

    // Gentle bob
    root.current.position.y = 0.47 + Math.sin(t * 1.6) * 0.06

    // Body turns toward the active tile's current world angle
    const ringRot = ringRef.current?.rotation.y ?? 0
    const targetYaw = hubState.engaged ? activeIndex() * STEP + ringRot : hubState.camAz
    root.current.rotation.y = dampAngle(root.current.rotation.y, targetYaw, 3, dt)

    // Head follows pointer / touch with smooth lag
    const px = hubState.pointer.x
    const py = hubState.pointer.y
    head.current.rotation.y = damp(head.current.rotation.y, px * 0.55, 4, dt)
    head.current.rotation.x = damp(head.current.rotation.x, -py * 0.22 + 0.05, 4, dt)
    head.current.rotation.z = damp(head.current.rotation.z, -px * 0.06, 4, dt)

    // Blink
    if (eyes.current) {
      const blinkPhase = t - nextBlink.current
      let sy = 1
      if (blinkPhase > 0 && blinkPhase < 0.16) sy = 0.12
      else if (blinkPhase >= 0.16) nextBlink.current = t + 2.5 + Math.random() * 3
      eyes.current.scale.y = damp(eyes.current.scale.y, sy, 40, dt)
    }

    // Floating hands
    if (leftHand.current && rightHand.current) {
      leftHand.current.position.y = 0.78 + Math.sin(t * 2.1) * 0.07
      rightHand.current.position.y = 0.78 + Math.sin(t * 2.1 + 1.6) * 0.07
    }

    // Antenna pulse
    const pulse = 0.5 + 0.5 * Math.sin(t * 3.2)
    if (antennaTip.current) antennaTip.current.scale.setScalar(0.9 + pulse * 0.25)
    if (antennaGlow.current) {
      antennaGlow.current.scale.setScalar(0.35 + pulse * 0.25)
      ;(antennaGlow.current.material as THREE.SpriteMaterial).opacity = 0.35 + pulse * 0.45
    }
  })

  return (
    <group ref={root} position={[0, 0.47, 0]}>
      {/* Body */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <capsuleGeometry args={[0.4, 0.28, 12, 32]} />
        <meshPhysicalMaterial {...pearl} />
      </mesh>
      {/* Chest light */}
      <mesh position={[0, 0.86, 0.395]} rotation={[-0.08, 0, 0]}>
        <circleGeometry args={[0.07, 32]} />
        <meshBasicMaterial color="#FF8A5C" toneMapped={false} />
      </mesh>
      <Glow position={[0, 0.86, 0.43]} scale={0.3} color="#FF8A5C" opacity={0.6} />
      <mesh position={[0, 0.86, 0.39]} rotation={[-0.08, 0, 0]}>
        <ringGeometry args={[0.1, 0.12, 40]} />
        <meshBasicMaterial color="#FFD3C2" toneMapped={false} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.27, 0]}>
        <cylinderGeometry args={[0.13, 0.16, 0.12, 24]} />
        <meshPhysicalMaterial color="#FFEFE9" roughness={0.3} clearcoat={1} />
      </mesh>

      {/* Head */}
      <group ref={head} position={[0, 1.66, 0]}>
        <RoundedBox args={[1.02, 0.78, 0.84]} radius={0.3} smoothness={6} castShadow>
          <meshPhysicalMaterial {...pearl} />
        </RoundedBox>
        {/* Visor */}
        <RoundedBox args={[0.84, 0.5, 0.1]} radius={0.2} smoothness={6} position={[0, -0.01, 0.39]}>
          <meshPhysicalMaterial color="#1F1033" roughness={0.06} metalness={0.4} clearcoat={1} clearcoatRoughness={0.02} />
        </RoundedBox>
        {/* Visor reflection highlight */}
        <mesh position={[-0.2, 0.12, 0.447]} rotation={[0, 0, 0.5]}>
          <planeGeometry args={[0.24, 0.04]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.35} />
        </mesh>
        {/* Eyes */}
        <group ref={eyes} position={[0, -0.01, 0.45]}>
          {[-0.18, 0.18].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <RoundedBox args={[0.13, 0.19, 0.02]} radius={0.06} smoothness={4}>
                <meshBasicMaterial color="#FF3700" toneMapped={false} />
              </RoundedBox>
              <Glow position={[0, 0, 0.03]} scale={0.42} color="#FF3700" opacity={0.55} />
            </group>
          ))}
        </group>
        {/* Ears */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.52, 0, 0]} rotation={[0, 0, (s * Math.PI) / 2]}>
            <mesh>
              <cylinderGeometry args={[0.13, 0.13, 0.08, 28]} />
              <meshPhysicalMaterial color="#FFEFE9" roughness={0.25} clearcoat={1} />
            </mesh>
            <mesh position={[0, -0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.085, 0.014, 10, 32]} />
              <meshBasicMaterial color="#FF8A5C" toneMapped={false} />
            </mesh>
          </group>
        ))}
        {/* Antenna */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.018, 0.022, 0.24, 12]} />
          <meshPhysicalMaterial color="#FFEFE9" roughness={0.3} />
        </mesh>
        <mesh ref={antennaTip} position={[0, 0.65, 0]}>
          <sphereGeometry args={[0.06, 24, 24]} />
          <meshBasicMaterial color="#FF8A5C" toneMapped={false} />
        </mesh>
        <Glow spriteRef={antennaGlow} position={[0, 0.65, 0]} scale={0.5} color="#FF8A5C" opacity={0.6} />
      </group>

      {/* Floating hands */}
      {[
        { ref: leftHand, x: -0.68 },
        { ref: rightHand, x: 0.68 },
      ].map(({ ref, x }) => (
        <group key={x} ref={ref} position={[x, 0.78, 0.08]}>
          <mesh castShadow>
            <sphereGeometry args={[0.14, 32, 32]} />
            <meshPhysicalMaterial {...pearl} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.1, 0.012, 8, 32]} />
            <meshBasicMaterial color="#FF8A5C" toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
