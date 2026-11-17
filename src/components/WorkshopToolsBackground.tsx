import { useEffect, useRef } from "react"
import * as THREE from "three"

function createWrench() {
  const group = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ color: 0x9aa3ad, metalness: 0.9, roughness: 0.28 })
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.6, 0.08), metal)
  handle.position.y = 0.1
  group.add(handle)
  const head = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 10, 24, Math.PI * 1.35), metal)
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
  const steel = new THREE.MeshStandardMaterial({ color: 0x8f99a3, metalness: 0.85, roughness: 0.32 })
  const wood = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, metalness: 0.05, roughness: 0.8 })
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 1.6, 12), wood)
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
  const metal = new THREE.MeshStandardMaterial({ color: 0xb4bcc6, metalness: 0.9, roughness: 0.25 })
  const plastic = new THREE.MeshStandardMaterial({ color: 0xd9480f, metalness: 0.1, roughness: 0.5 })
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.3, 12), metal)
  shaft.position.y = 0.15
  group.add(shaft)
  const tip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.02), metal)
  tip.position.y = 0.84
  group.add(tip)
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.7, 16), plastic)
  grip.position.y = -0.55
  group.add(grip)
  return group
}

function createBolt() {
  const group = new THREE.Group()
  const metal = new THREE.MeshStandardMaterial({ color: 0xa8b0ba, metalness: 0.9, roughness: 0.3 })
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 6), metal)
  head.position.y = 0.35
  group.add(head)
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.7, 16), metal)
  shaft.position.y = -0.03
  group.add(shaft)
  const thread = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.015, 8, 24), metal)
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
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: false })
  geo.center()
  const mat = new THREE.MeshStandardMaterial({ color: 0x88929d, metalness: 0.9, roughness: 0.32 })
  return new THREE.Mesh(geo, mat)
}

function createTire() {
  const group = new THREE.Group()
  const rubber = new THREE.MeshStandardMaterial({ color: 0x1f2328, metalness: 0.05, roughness: 0.95 })
  const rim = new THREE.MeshStandardMaterial({ color: 0xb7c0ca, metalness: 0.85, roughness: 0.25 })
  const tire = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.22, 16, 48), rubber)
  tire.rotation.y = Math.PI / 2
  group.add(tire)
  const rimMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.18, 24), rim)
  rimMesh.rotation.z = Math.PI / 2
  group.add(rimMesh)
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.22, 16), rim)
  hub.rotation.z = Math.PI / 2
  group.add(hub)
  return group
}

function createNut() {
  const metal = new THREE.MeshStandardMaterial({ color: 0xaeb6bf, metalness: 0.88, roughness: 0.32 })
  const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 6), metal)
  const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.16, 20), new THREE.MeshStandardMaterial({ color: 0x22272e, metalness: 0.2, roughness: 0.8 }))
  hole.rotation.x = 0
  const group = new THREE.Group()
  group.add(nut)
  // visual hole approximation: dark ring
  const inner = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 8, 24), new THREE.MeshStandardMaterial({ color: 0x2b3138, metalness: 0.4, roughness: 0.6 }))
  inner.rotation.x = Math.PI / 2
  inner.position.y = 0.071
  group.add(inner)
  return group
}

export function WorkshopToolsBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
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

    const objects: Array<{ obj: THREE.Object3D; rot: THREE.Vector3; drift: number; baseY: number }> = []
    const factories = [createWrench, createHammer, createScrewdriver, createBolt, createNut, createTire, () => createGear(0.45, 10), () => createGear(0.35, 8)]

    for (let i = 0; i < 26; i++) {
      const obj = factories[i % factories.length]()
      const spreadX = (Math.random() - 0.5) * 22
      const spreadY = (Math.random() - 0.5) * 12
      const spreadZ = -2 - Math.random() * 14
      obj.position.set(spreadX, spreadY, spreadZ)
      const s = 0.7 + Math.random() * 1.4
      obj.scale.setScalar(s)
      obj.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      scene.add(obj)
      objects.push({
        obj,
        rot: new THREE.Vector3((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.4),
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

    let raf = 0
    let last = performance.now()
    const animate = (now: number) => {
      raf = requestAnimationFrame(animate)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const t = now * 0.001

      if (!prefersReducedMotion) {
        camera.position.x = Math.sin(t * 0.12) * 0.6
        camera.position.y = 0.5 + Math.cos(t * 0.1) * 0.25
        camera.lookAt(0, 0, -6)

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
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="workshop-tools-bg" aria-hidden="true" />
}