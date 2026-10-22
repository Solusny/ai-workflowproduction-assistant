// @ts-nocheck -- imported code written for a looser TypeScript config
import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, Line, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { FEATURES, type Feature } from '../../data/features'
import { hubState, milestonePosition, activeIndex } from '../../lib/hubState'
import { Glow } from './glow'

const RADIUS = 3.45
const STEP = (Math.PI * 2) / FEATURES.length
const TILE_Y = 1.1
const PULSES_PER_PATH = 3
const damp = THREE.MathUtils.damp

/** Rotate a tile-aligned point (tile on +Z) into ring space at angle theta. */
const place = (x: number, y: number, z: number, theta: number) =>
  new THREE.Vector3(x * Math.cos(theta) + z * Math.sin(theta), y, -x * Math.sin(theta) + z * Math.cos(theta))

/** Right-angle circuit trace from the platform edge to the base of tile i. */
function buildTrace(i: number) {
  const theta = i * STEP
  const s = i % 2 === 0 ? 1 : -1
  const y = 0.025
  const pts: [number, number, number][] = [
    [0, y, 2.42],
    [0, y, 2.72],
    [s * 0.42, y, 2.72],
    [s * 0.42, y, 3.12],
    [0, y, 3.12],
    [0, y, RADIUS],
    [0, TILE_Y - 0.5, RADIUS],
  ]
  const points = pts.map(([x, py, z]) => place(x, py, z, theta))
  const lengths = [0]
  for (let k = 1; k < points.length; k++) lengths.push(lengths[k - 1] + points[k].distanceTo(points[k - 1]))
  return { points, lengths, total: lengths[lengths.length - 1] }
}

function pointAt(trace: ReturnType<typeof buildTrace>, u: number, out: THREE.Vector3) {
  const d = u * trace.total
  let k = 1
  while (k < trace.lengths.length - 1 && trace.lengths[k] < d) k++
  const a = trace.lengths[k - 1]
  const segLen = trace.lengths[k] - a || 1
  return out.lerpVectors(trace.points[k - 1], trace.points[k], (d - a) / segLen)
}

interface RingProps {
  onSelect: (feature: Feature) => void
}

/** Five feature tiles orbiting the platform, linked by circuit traces carrying light pulses. */
export const FeatureRing = forwardRef<THREE.Group, RingProps>(function FeatureRing({ onSelect }, ref) {
  const ring = useRef<THREE.Group>(null)
  const traces = useMemo(() => FEATURES.map((_, i) => buildTrace(i)), [])
  const pulses = useRef<THREE.InstancedMesh>(null)
  const halos = useRef<THREE.InstancedMesh>(null)
  const phases = useRef(FEATURES.map(() => 0))
  const intensity = useRef(FEATURES.map(() => 0))
  const tmp = useMemo(() => ({ v: new THREE.Vector3(), o: new THREE.Object3D(), c: new THREE.Color(), coral: new THREE.Color('#FF8A5C'), accent: new THREE.Color('#FF3700') }), [])

  useLayoutEffect(() => {
    if (typeof ref === 'function') ref(ring.current)
    else if (ref) ref.current = ring.current
  }, [ref])

  useFrame((state, dt) => {
    const g = ring.current
    if (!g) return
    dt = Math.min(dt, 0.05)

    // Ring rotation: idle drift, or scroll-driven so the active tile faces the camera
    if (!hubState.engaged) {
      if (hubState.hovered < 0) g.rotation.y -= dt * 0.16
    } else {
      let target = hubState.camAz - milestonePosition() * STEP
      const twoPi = Math.PI * 2
      target += Math.round((g.rotation.y - target) / twoPi) * twoPi
      g.rotation.y = damp(g.rotation.y, target, 3.2, dt)
    }
    const front = Math.round((hubState.camAz - g.rotation.y) / STEP)
    hubState.front = ((front % FEATURES.length) + FEATURES.length) % FEATURES.length

    // Pulses travel from platform to tile; the active line speeds up and brightens
    const active = activeIndex()
    const t = state.clock.elapsedTime
    traces.forEach((trace, i) => {
      const on = i === active || i === hubState.hovered ? 1 : 0
      intensity.current[i] = damp(intensity.current[i], on, 4, dt)
      const k = intensity.current[i]
      phases.current[i] += dt * (0.28 + k * 0.75)
      for (let j = 0; j < PULSES_PER_PATH; j++) {
        const idx = i * PULSES_PER_PATH + j
        const u = (phases.current[i] + j / PULSES_PER_PATH) % 1
        pointAt(trace, u, tmp.v)
        const fade = Math.min(1, u * 8, (1 - u) * 8)
        tmp.o.position.copy(tmp.v)
        tmp.o.scale.setScalar((0.045 + k * 0.025) * fade)
        tmp.o.updateMatrix()
        pulses.current?.setMatrixAt(idx, tmp.o.matrix)
        tmp.o.scale.setScalar((0.13 + k * 0.09) * fade * (0.9 + 0.1 * Math.sin(t * 8 + idx)))
        tmp.o.updateMatrix()
        halos.current?.setMatrixAt(idx, tmp.o.matrix)
        tmp.c.copy(tmp.coral).lerp(tmp.accent, k)
        pulses.current?.setColorAt(idx, tmp.c)
        halos.current?.setColorAt(idx, tmp.c)
      }
    })
    for (const m of [pulses.current, halos.current]) {
      if (!m) continue
      m.instanceMatrix.needsUpdate = true
      if (m.instanceColor) m.instanceColor.needsUpdate = true
    }
  })

  return (
    <group ref={ring}>
      {traces.map((trace, i) => (
        <group key={i}>
          <Line points={trace.points} color="#FF8A5C" lineWidth={2} transparent opacity={0.85} />
          {[trace.points[0], trace.points[trace.points.length - 2]].map((p, j) => (
            <mesh key={j} position={[p.x, 0.028, p.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.06, 20]} />
              <meshBasicMaterial color="#FF3700" toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}

      <instancedMesh ref={pulses} frustumCulled={false} args={[undefined, undefined, FEATURES.length * PULSES_PER_PATH]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={halos} frustumCulled={false} args={[undefined, undefined, FEATURES.length * PULSES_PER_PATH]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial transparent opacity={0.22} depthWrite={false} toneMapped={false} />
      </instancedMesh>

      {FEATURES.map((f, i) => (
        <Tile key={f.id} feature={f} index={i} onSelect={onSelect} />
      ))}
    </group>
  )
})

function Tile({ feature, index, onSelect }: { feature: Feature; index: number; onSelect: (f: Feature) => void }) {
  const theta = index * STEP
  const group = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const glow = useRef<THREE.Sprite>(null)
  const edge = useRef<THREE.MeshBasicMaterial>(null)
  const label = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)
  const lookTarget = useMemo(() => new THREE.Vector3(), [])
  const world = useMemo(() => new THREE.Vector3(), [])
  const Icon = feature.icon
  // Keep DOM labels proportional to the tile size regardless of canvas height
  const canvasHeight = useThree((s) => s.size.height)
  const labelScale = THREE.MathUtils.clamp(canvasHeight / 900, 0.55, 1.2)

  useFrame((state, dt) => {
    if (!group.current || !body.current) return
    const t = state.clock.elapsedTime
    const isActive = activeIndex() === index
    const lift = hovered ? 0.28 : isActive ? 0.14 : 0
    body.current.position.y = damp(body.current.position.y, lift + Math.sin(t * 1.3 + index) * 0.05, 6, dt)
    const s = hovered ? 1.08 : isActive ? 1.04 : 1
    body.current.scale.setScalar(damp(body.current.scale.x, s, 6, dt))

    // Billboard (yaw only) toward the camera so tiles always read correctly
    group.current.getWorldPosition(world)
    lookTarget.set(state.camera.position.x, world.y, state.camera.position.z)
    group.current.lookAt(lookTarget)

    // Fade labels on the far side of the ring so they never cover the robot
    if (label.current) {
      const facing = Math.cos(Math.atan2(world.x, world.z) - hubState.camAz)
      label.current.style.opacity = String(THREE.MathUtils.clamp(0.25 + (facing + 0.6) * 0.75, 0.25, 1))
    }

    const glowTarget = hovered ? 0.85 : isActive ? 0.6 : 0.22
    if (glow.current) {
      const m = glow.current.material as THREE.SpriteMaterial
      m.opacity = damp(m.opacity, glowTarget, 5, dt)
    }
    if (edge.current) edge.current.opacity = damp(edge.current.opacity, hovered || isActive ? 0.95 : 0.4, 5, dt)
  })

  const over = () => {
    setHovered(true)
    hubState.hovered = index
    document.body.style.cursor = 'pointer'
  }
  const out = () => {
    setHovered(false)
    if (hubState.hovered === index) hubState.hovered = -1
    document.body.style.cursor = ''
  }

  return (
    <group ref={group} position={[Math.sin(theta) * RADIUS, TILE_Y, Math.cos(theta) * RADIUS]}>
      <group ref={body}>
        <Glow position={[0, 0, -0.12]} scale={[2.3, 1.7, 1]} color="#FF3700" opacity={0.22} spriteRef={glow} />
        {/* Glowing edge */}
        <RoundedBox args={[1.62, 1.04, 0.12]} radius={0.12} smoothness={4} position={[0, 0, -0.03]}>
          <meshBasicMaterial ref={edge} color="#FF3700" transparent opacity={0.4} toneMapped={false} />
        </RoundedBox>
        {/* White glass body */}
        <RoundedBox
          args={[1.56, 0.98, 0.18]}
          radius={0.1}
          smoothness={5}
          castShadow
          onPointerOver={(e) => {
            e.stopPropagation()
            over()
          }}
          onPointerOut={out}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(feature)
          }}
        >
          <meshPhysicalMaterial color="#FFFFFF" roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} transparent opacity={0.94} />
        </RoundedBox>
        {/* Tinted top face */}
        <RoundedBox args={[1.5, 0.08, 0.2]} radius={0.035} smoothness={4} position={[0, 0.46, 0]}>
          <meshPhysicalMaterial color="#FFEFE9" roughness={0.2} clearcoat={1} />
        </RoundedBox>
        <Html center position={[0, -0.02, 0.1]} distanceFactor={9 * labelScale} zIndexRange={[20, 0]}>
          <button
            ref={label}
            type="button"
            onPointerEnter={over}
            onPointerLeave={out}
            onClick={() => onSelect(feature)}
            className="flex w-[150px] select-none flex-col items-center gap-1.5 rounded-xl px-2 py-1 text-center focus-visible:outline-accent"
            aria-label={`Open ${feature.title}`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-tint-1 text-accent ring-1 ring-tint-2">
              <Icon size={18} strokeWidth={2.4} />
            </span>
            <span className="text-[15px] leading-tight font-extrabold text-ink">{feature.title}</span>
          </button>
        </Html>
      </group>
    </group>
  )
}
