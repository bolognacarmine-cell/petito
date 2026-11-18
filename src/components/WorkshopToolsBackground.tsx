import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

function createWrench() {
  const group = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({
    color: 0x9aa3ad,
    metalness: 0.9,
    roughness: 0.28,
  })
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.6, 0.08), metal)
  handle.position.y = 0.1
  group.add(handle)
  const head = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.06, 10, 24, Math.PI * 1.35),
    metal,
  )
  head.position.set(0.08, 0.98, 0)
  head.rotation.z = Math.PI * 0.15
  group.add(head)
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.08), metal)
  jaw.position.set(-0.05, 0.82, 0)
  jaw.rotation.z = -0.5
  group.add(jaw)
  return group
}

function createHammer() {
  const group = new THREE.Group()
  const steel = new THREE.MeshStandardMaterial({
    color: 0x8f99a3,
    metalness: 0.85,
    roughness: 0.32,
  })
  const wood = new THREE.MeshStandardMaterial({
    color: 0x8b5a2b,
    metalness: 0.05,
    roughness: 0.8,
  })
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.055, 1.6, 12),
    wood,
  )
  handle.position.y = -0.1
  group.add(handle)
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.22), steel)
  head.position.y = 0.72
  group.add(head)
  const claw = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.18), steel)
  claw.position.set(-0.38, 0.72, 0)
  claw.rotation.z = 0.5
  group.add(claw)
  return group
}

function createScrewdriver() {
  const group = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({
    color: 0xb4bcc6,
    metalness: 0.9,
    roughness: 0.25,
  })
  const plastic = new THREE.MeshStandardMaterial({
    color: 0xd9480f,
    metalness: 0.1,
    roughness: 0.5,
  })
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.3, 12),
    metal,
  )
  shaft.position.y = 0.15
  group.add(shaft)
  const tip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.02), metal)
  tip.position.y = 0.84
  group.add(tip)
  const grip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.08, 0.7, 16),
    plastic,
  )
  grip.position.y = -0.55
  group.add(grip)
  return group
}

function createBolt() {
  const group = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({
    color: 0xa8b0ba,
    metalness: 0.9,
    roughness: 0.3,
  })
  const head = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.12, 6),
    metal,
  )
  head.position.y = 0.35
  group.add(head)
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.7, 16),
    metal,
  )
  shaft.position.y = -0.03
  group.add(shaft)
  const thread = new THREE.Mesh(
    new THREE.TorusGeometry(0.085, 0.015, 8, 24),
    metal,
  )
  thread.rotation.x = Math.PI / 2
  thread.position.y = -0.1
  group.add(thread)
  return group
}

function createGear(radius = 0.45, teeth = 10) {
  const shape = new THREE.Shape()
  const inner = radius * 0.55
  const outer = radius
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2
    const r = i % 2 === 0 ? outer : inner
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  const hole = new THREE.Path()
  hole.absarc(0, 0, radius * 0.18, 0, Math.PI * 2, true)
  shape.holes.push(hole)
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: false,
  })
  geo.center()
  const mat = new THREE.MeshStandardMaterial({
    color: 0x88929d,
    metalness: 0.9,
    roughness: 0.32,
  })
  return new THREE.Mesh(geo, mat)
}

function createPliers() {
  const group = new THREE.Group()
  const steel = new THREE.MeshStandardMaterial({
    color: 0xa7b0ba,
    metalness: 0.9,
    roughness: 0.3,
  })
  const grip = new THREE.MeshStandardMaterial({
    color: 0xe0552a,
    metalness: 0.1,
    roughness: 0.6,
  })
  const jawGeo = new THREE.BoxGeometry(0.09, 0.9, 0.09)
  const leftJaw = new THREE.Mesh(jawGeo, steel)
  leftJaw.rotation.z = 0.22
  leftJaw.position.set(-0.12, 0.15, 0)
  const rightJaw = new THREE.Mesh(jawGeo, steel)
  rightJaw.rotation.z = -0.22
  rightJaw.position.set(0.12, 0.15, 0)
  const gripGeo = new THREE.CylinderGeometry(0.075, 0.09, 0.75, 12)
  const leftGrip = new THREE.Mesh(gripGeo, grip)
  leftGrip.rotation.z = 0.25
  leftGrip.position.set(-0.26, -0.65, 0)
  const rightGrip = new THREE.Mesh(gripGeo, grip)
  rightGrip.rotation.z = -0.25
  rightGrip.position.set(0.26, -0.65, 0)
  const joint = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.12, 16),
    steel,
  )
  joint.rotation.x = Math.PI / 2
  group.add(leftJaw, rightJaw, leftGrip, rightGrip, joint)
  return group
}

function createSocket() {
  const group = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({
    color: 0xbcc5cf,
    metalness: 0.92,
    roughness: 0.26,
  })
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.5, 6, 1, true),
    metal,
  )
  body.position.y = 0.2
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.035, 8, 6), metal)
  lip.rotation.x = Math.PI / 2
  lip.position.y = 0.45
  const drive = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.36, 12),
    metal,
  )
  drive.rotation.z = Math.PI / 2
  drive.position.y = -0.2
  group.add(body, lip, drive)
  return group
}

function createRatchet() {
  const group = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({
    color: 0x9fa9b4,
    metalness: 0.9,
    roughness: 0.3,
  })
  const dark = new THREE.MeshStandardMaterial({
    color: 0x2a2f35,
    metalness: 0.5,
    roughness: 0.6,
  })
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.17, 1.3, 0.1), metal)
  handle.position.y = -0.1
  const head = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.12, 16),
    metal,
  )
  head.rotation.x = Math.PI / 2
  head.position.y = 0.62
  const selector = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.14), dark)
  selector.position.set(0, 0.62, 0.08)
  group.add(handle, head, selector)
  return group
}

function createPryBar() {
  const group = new THREE.Group()
  const steel = new THREE.MeshStandardMaterial({
    color: 0x87919c,
    metalness: 0.88,
    roughness: 0.34,
  })
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 1.7, 10),
    steel,
  )
  const hook = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.055, 8, 16, Math.PI),
    steel,
  )
  hook.position.y = 0.92
  hook.rotation.z = Math.PI / 2
  const tip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.08), steel)
  tip.position.y = -0.88
  group.add(shaft, hook, tip)
  return group
}

function createNut() {
  const metal = new THREE.MeshStandardMaterial({
    color: 0xaeb6bf,
    metalness: 0.88,
    roughness: 0.32,
  })
  const nut = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.14, 6),
    metal,
  )
  const hole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.16, 20),
    new THREE.MeshStandardMaterial({
      color: 0x22272e,
      metalness: 0.2,
      roughness: 0.8,
    }),
  )
  hole.rotation.x = 0
  const group = new THREE.Group()
  group.add(nut)
  // visual hole approximation: dark ring
  const inner = new THREE.Mesh(
    new THREE.TorusGeometry(0.09, 0.015, 8, 24),
    new THREE.MeshStandardMaterial({
      color: 0x2b3138,
      metalness: 0.4,
      roughness: 0.6,
    }),
  )
  inner.rotation.x = Math.PI / 2
  inner.position.y = 0.071
  group.add(inner)
  return group
}

function useMouseTracker() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth
      const h = window.innerHeight
      setMouse({
        x: (e.clientX / w) * 2 - 1,
        y: -(e.clientY / h) * 2 + 1,
      })
    }
    window.addEventListener("mousemove", onMouseMove)
    return () => window.removeEventListener("mousemove", onMouseMove)
  }, [])

  return mouse
}

export function WorkshopToolsBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useMouseTracker()
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x0e1114, 10, 30)

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(0, 0.5, 14)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffecd6, 0.8))
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(6, 8, 6)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xcfe3ff, 1.0)
    fill.position.set(-5, 3, 4)
    scene.add(fill)
    const warm = new THREE.PointLight(0xff9a4a, 28, 45)
    warm.position.set(4, 2, 8)
    scene.add(warm)
    const cool = new THREE.PointLight(0x8fd0ff, 14, 40)
    cool.position.set(-6, -1, 6)
    scene.add(cool)

    const objects: Array<{
      obj: THREE.Object3D
      rot: THREE.Vector3
      drift: number
      baseY: number
    }> = []
    const factories = [
      createWrench,
      createHammer,
      createScrewdriver,
      createBolt,
      createNut,
      createPliers,
      createSocket,
      createRatchet,
      createPryBar,
      () => createGear(0.45, 10),
      () => createGear(0.35, 8),
    ]

    for (let i = 0; i < 26; i++) {
      const obj = factories[i % factories.length]()
      const spreadX = (Math.random() - 0.5) * 22
      const spreadY = (Math.random() - 0.5) * 12
      const spreadZ = -2 - Math.random() * 14
      obj.position.set(spreadX, spreadY, spreadZ)
      const s = 0.7 + Math.random() * 1.4
      obj.scale.setScalar(s)
      obj.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      )
      scene.add(obj)
      objects.push({
        obj,
        rot: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.4,
        ),
        drift: Math.random() * Math.PI * 2,
        baseY: spreadY,
      })
    }

    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / Math.max(1, h)
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    window.addEventListener("resize", onResize)
    onResize()

    const target = new THREE.Vector3(0, 0, -6)

    let raf = 0
    let last = performance.now()
    const animate = (now: number) => {
      raf = requestAnimationFrame(animate)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const t = now * 0.001

      if (!reducedMotion) {
        const targetX = mouse.x * 2
        const targetY = mouse.y * 1.5
        target.lerp(new THREE.Vector3(targetX, targetY, -6), 0.05)
        camera.position.lerp(target, 0.08)
        camera.lookAt(target)

        objects.forEach((o, i) => {
          o.obj.rotation.x += o.rot.x * dt
          o.obj.rotation.y += o.rot.y * dt
          o.obj.rotation.z += o.rot.z * dt
          o.obj.position.y = o.baseY + Math.sin(t * 0.5 + o.drift) * 0.25
          o.obj.position.x += Math.sin(t * 0.15 + i) * 0.0015
        })
      }

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const mat = (mesh as any).material
        if (mat) {
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
          else mat.dispose()
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === container)
        container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={containerRef} className="workshop-tools-bg" aria-hidden="true" />
  )
}
