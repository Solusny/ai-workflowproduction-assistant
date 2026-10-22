import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, ContactShadows, Environment, Lightformer, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import type { Feature } from '../../data/features'
import { hubState, milestonePosition } from '../../lib/hubState'
import { Robot } from './Robot'
import { Platform } from './Platform'
import { Holograms } from './Holograms'
import { FeatureRing } from './FeatureRing'
import { Particles } from './Particles'

const BASE_AZ = 0.38 // slightly off-axis
const ELEVATION = THREE.MathUtils.degToRad(37) // isometric-style look-down
const LOOK_AT = new THREE.Vector3(0, 1.05, 0)

/** Fixed isometric-style camera with scroll-driven push-in/orbit and subtle pointer parallax. */
function CameraRig() {
  const { camera, size } = useThree()
  const state = useRef({ az: BASE_AZ, dist: 14, el: ELEVATION })

  useFrame((_, dt) => {
    dt = Math.min(dt, 0.05)
    const aspect = size.width / size.height
    const baseDist = aspect < 1 ? 13.5 / Math.pow(aspect, 0.75) : 13.5
    const a = milestonePosition()
    const nearMilestone = hubState.engaged ? 1 - Math.min(1, Math.abs(a - Math.round(a)) * 2) : 0

    // ~13° orbit across the whole journey, plus a gentle push-in at each milestone
    const targetAz = BASE_AZ + (hubState.engaged ? hubState.progress * 0.23 : 0) + hubState.pointer.x * 0.03
    const targetDist = baseDist * (hubState.engaged ? 0.93 - nearMilestone * 0.05 : 1)
    const targetEl = ELEVATION + hubState.pointer.y * 0.02

    const s = state.current
    s.az = THREE.MathUtils.damp(s.az, targetAz, 2.5, dt)
    s.dist = THREE.MathUtils.damp(s.dist, targetDist, 2.5, dt)
    s.el = THREE.MathUtils.damp(s.el, targetEl, 2.5, dt)
    hubState.camAz = s.az

    camera.position.set(
      Math.sin(s.az) * Math.cos(s.el) * s.dist,
      LOOK_AT.y + Math.sin(s.el) * s.dist,
      Math.cos(s.az) * Math.cos(s.el) * s.dist,
    )
    camera.lookAt(LOOK_AT)
  })
  return null
}

function Scene({ onSelect }: { onSelect: (f: Feature) => void }) {
  const ringRef = useRef<THREE.Group>(null)
  return (
    <>
      <CameraRig />

      {/* Warm key, cool lavender fill, orange rim */}
      <ambientLight intensity={0.35} color="#FFF4EE" />
      <directionalLight position={[5, 9, 6]} intensity={2.2} color="#FFF0E6" />
      <hemisphereLight args={['#E6DEFF', '#FFEFE9', 0.7]} />
      <pointLight position={[-5, 3.5, -5]} intensity={40} distance={22} color="#FF8A5C" />
      <pointLight position={[4, 1.5, -4]} intensity={18} distance={16} color="#FF3700" />

      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#FFFFFF" position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={[10, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#E6DEFF" position={[-6, 2, 3]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={2} color="#FF8A5C" position={[5, 2, -4]} scale={3} />
        <Lightformer form="rect" intensity={1} color="#FFD3C2" position={[0, 1, 8]} scale={[10, 3, 1]} />
      </Environment>

      <group position={[0, 0, 0]}>
        <Platform />
        <Holograms />
        <Robot ringRef={ringRef} />
        <FeatureRing ref={ringRef} onSelect={onSelect} />
        <Particles />
      </group>

      <ContactShadows position={[0, 0.001, 0]} scale={11} opacity={0.22} blur={2.8} far={3.5} resolution={256} frames={1} color="#1F1033" />
    </>
  )
}

export default function HubScene({
  onSelect,
  onReady,
  active = true,
}: {
  onSelect: (f: Feature) => void
  onReady?: () => void
  active?: boolean
}) {
  const [maxDpr, setMaxDpr] = useState(1.5)
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, maxDpr]}
      camera={{ fov: 36, near: 0.1, far: 80, position: [5, 9, 11] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        requestAnimationFrame(() => onReady?.())
      }}
      aria-label="Interactive 3D AI command hub showing the five WorkFlow AI tools"
    >
      <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
      <AdaptiveDpr pixelated={false} />
      <Suspense fallback={null}>
        <Scene onSelect={onSelect} />
      </Suspense>
    </Canvas>
  )
}
