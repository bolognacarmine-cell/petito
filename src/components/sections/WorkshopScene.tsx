import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

function createSignTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 1024
  canvas.height = 256
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillStyle = "#f7e8d5"
  ctx.font = "900 122px Georgia, 'Times New Roman', serif"
  ctx.fillText("PETITO CAR", 512, 98)

  ctx.fillStyle = "#e0743c"
  ctx.font = "600 42px system-ui, -apple-system, sans-serif"
  ctx.fillText("S E R V I C E   S R L S", 512, 192)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function normalizeLoadedCar(root: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(root)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  const maxDim = Math.max(size.x, size.y, size.z) || 1
  const target = 4.8
  const scale = target / maxDim
  root.scale.setScalar(scale)

  box.setFromObject(root)
  box.getCenter(center)
  root.position.x += -center.x
  root.position.z += -center.z
  root.position.y += -box.min.y

  root.rotation.y = -Math.PI / 2

  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })
}

export function WorkshopScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x120f0d)
    scene.fog = new THREE.Fog(0x120f0d, 12, 28)

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100)
    const cameraRadius = 7.2
    const baseAngle = 0.05
    camera.position.set(
      Math.sin(baseAngle) * cameraRadius,
      2.45,
      Math.cos(baseAngle) * cameraRadius,
    )
    camera.lookAt(0, 0.85, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.14
    container.appendChild(renderer.domElement)

    // --- Layout groups -----------------------------------------------------
    const props = new THREE.Group()
    scene.add(props)

    const disposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture> =
      []
    const track =
      <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture,>(
        item: T,
      ) => {
        disposables.push(item)
        return item
      }

    const standard = (params: THREE.MeshStandardMaterialParameters) =>
      track(new THREE.MeshStandardMaterial(params))

    // --- Floor -------------------------------------------------------------
    const floorMat = standard({
      color: 0x201c19,
      roughness: 0.88,
      metalness: 0.12,
    })
    const floor = new THREE.Mesh(
      track(new THREE.PlaneGeometry(40, 40)),
      floorMat,
    )
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    const bayMat = track(
      new THREE.MeshBasicMaterial({
        color: 0xd9772f,
        transparent: true,
        opacity: 0.5,
      }),
    )
    const bayWidth = 8.6
    const bayDepth = 6.0
    const lineThickness = 0.05
    const bayParts: Array<[number, number, number, number]> = [
      [bayWidth, lineThickness, 0, bayDepth / 2],
      [bayWidth, lineThickness, 0, -bayDepth / 2],
      [lineThickness, bayDepth, bayWidth / 2, 0],
      [lineThickness, bayDepth, -bayWidth / 2, 0],
    ]
    bayParts.forEach(([w, d, x, z]) => {
      const strip = new THREE.Mesh(track(new THREE.PlaneGeometry(w, d)), bayMat)
      strip.rotation.x = -Math.PI / 2
      strip.position.set(x, 0.006, z)
      scene.add(strip)
    })

    // --- Back and side walls ------------------------------------------------
    const wallMat = standard({
      color: 0x262120,
      roughness: 0.95,
      metalness: 0.05,
    })
    const backWall = new THREE.Mesh(
      track(new THREE.PlaneGeometry(40, 10)),
      wallMat,
    )
    backWall.position.set(0, 4.2, -7)
    scene.add(backWall)

    const sideWall = new THREE.Mesh(
      track(new THREE.PlaneGeometry(24, 10)),
      wallMat,
    )
    sideWall.position.set(-11, 4.2, 0)
    sideWall.rotation.y = Math.PI / 2
    scene.add(sideWall)

    const baseboardMat = standard({ color: 0x120e0c, roughness: 0.9 })
    const baseboard = new THREE.Mesh(
      track(new THREE.BoxGeometry(40, 0.28, 0.12)),
      baseboardMat,
    )
    baseboard.position.set(0, 0.14, -6.94)
    scene.add(baseboard)

    const accentStrip = new THREE.Mesh(
      track(new THREE.BoxGeometry(40, 0.03, 0.03)),
      track(
        new THREE.MeshBasicMaterial({
          color: 0xef5b2a,
          transparent: true,
          opacity: 0.55,
        }),
      ),
    )
    accentStrip.position.set(0, 0.3, -6.87)
    scene.add(accentStrip)

    // --- Brand sign on the back wall ---------------------------------------
    const signTexture = createSignTexture()
    if (signTexture) {
      track(signTexture)
      const sign = new THREE.Mesh(
        track(new THREE.PlaneGeometry(5.6, 1.4)),
        track(
          new THREE.MeshBasicMaterial({
            map: signTexture,
            transparent: true,
            toneMapped: false,
          }),
        ),
      )
      sign.position.set(0, 3.5, -6.9)
      scene.add(sign)

      const signGlow = new THREE.PointLight(0xffb877, 6, 7, 2)
      signGlow.position.set(0, 3.3, -5.6)
      scene.add(signGlow)
    }

    // --- Turntable platform -------------------------------------------------
    const steelMat = standard({
      color: 0xb9bec6,
      roughness: 0.35,
      metalness: 0.9,
    })
    const platformMat = standard({
      color: 0x35302c,
      roughness: 0.55,
      metalness: 0.6,
    })
    const platform = new THREE.Mesh(
      track(new THREE.CylinderGeometry(2.9, 3.0, 0.16, 72)),
      platformMat,
    )
    platform.position.y = 0.08
    platform.receiveShadow = true
    platform.castShadow = true
    scene.add(platform)

    const platformTop = new THREE.Mesh(
      track(new THREE.CylinderGeometry(2.86, 2.86, 0.02, 72)),
      standard({ color: 0x2b2724, roughness: 0.7, metalness: 0.5 }),
    )
    platformTop.position.y = 0.17
    platformTop.receiveShadow = true
    scene.add(platformTop)

    const ring = new THREE.Mesh(
      track(new THREE.TorusGeometry(2.91, 0.025, 8, 96)),
      track(
        new THREE.MeshBasicMaterial({
          color: 0xef5b2a,
          transparent: true,
          opacity: 0.5,
        }),
      ),
    )
    ring.rotation.x = Math.PI / 2
    ring.position.y = 0.17
    scene.add(ring)

    // --- Bench materials ----------------------------------------------------
    const chestDark = standard({
      color: 0x6f2419,
      roughness: 0.6,
      metalness: 0.3,
    })

    // --- Workbench ----------------------------------------------------------
    const bench = new THREE.Group()
    bench.position.set(-4.35, 0, -3.95)
    bench.rotation.y = 0.1
    scene.add(bench)

    const benchTopMat = standard({ color: 0x6b5844, roughness: 0.8 })
    const benchTop = new THREE.Mesh(
      track(new THREE.BoxGeometry(2.4, 0.09, 0.9)),
      benchTopMat,
    )
    benchTop.position.y = 0.98
    benchTop.castShadow = true
    benchTop.receiveShadow = true
    bench.add(benchTop)

    const legMat = standard({ color: 0x2b2a28, roughness: 0.6, metalness: 0.7 })
    const legGeo = track(new THREE.BoxGeometry(0.08, 0.98, 0.08))
    const legOffsets: Array<[number, number]> = [
      [-1.08, -0.36],
      [1.08, -0.36],
      [-1.08, 0.36],
      [1.08, 0.36],
    ]
    legOffsets.forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat)
      leg.position.set(x, 0.49, z)
      leg.castShadow = true
      bench.add(leg)
    })

    const vise = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.34, 0.22, 0.24)),
      legMat,
    )
    vise.position.set(0.78, 1.13, 0)
    vise.castShadow = true
    bench.add(vise)

    const toolTray = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.6, 0.04, 0.34)),
      chestDark,
    )
    toolTray.position.set(-0.62, 1.02, 0.12)
    bench.add(toolTray)

    for (let i = 0; i < 4; i += 1) {
      const tool = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.022, 0.022, 0.3, 8)),
        steelMat,
      )
      tool.rotation.z = Math.PI / 2
      tool.position.set(-0.72 + i * 0.07, 1.06, 0.12 + i * 0.04)
      bench.add(tool)
    }

    const boardMat = standard({
      color: 0x2f3236,
      roughness: 0.7,
      metalness: 0.5,
    })
    const board = new THREE.Mesh(
      track(new THREE.BoxGeometry(2.9, 2.0, 0.1)),
      boardMat,
    )
    board.position.set(4.05, 2.75, -6.86)
    board.castShadow = true
    board.receiveShadow = true
    scene.add(board)

    const boardFrameMat = standard({
      color: 0x17191b,
      roughness: 0.55,
      metalness: 0.7,
    })
    const frameParts: Array<[number, number, number, number]> = [
      [2.98, 0.08, 4.05, 3.79],
      [2.98, 0.08, 4.05, 1.71],
      [0.08, 2.0, 2.58, 2.75],
      [0.08, 2.0, 5.52, 2.75],
    ]
    frameParts.forEach(([w, h, x, y]) => {
      const part = new THREE.Mesh(
        track(new THREE.BoxGeometry(w, h, 0.12)),
        boardFrameMat,
      )
      part.position.set(x, y, -6.8)
      part.castShadow = true
      scene.add(part)
    })

    const addWrench = (x: number, y: number, angle: number, scale = 1) => {
      const wrench = new THREE.Group()
      const handle = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.055, 0.62, 0.035)),
        steelMat,
      )
      handle.position.y = -0.16
      const head = new THREE.Mesh(
        track(new THREE.TorusGeometry(0.1, 0.032, 8, 18)),
        steelMat,
      )
      head.position.y = 0.2
      const tip = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.13, 0.07, 0.035)),
        steelMat,
      )
      tip.position.y = -0.47
      wrench.add(handle, head, tip)
      wrench.position.set(x, y, -6.76)
      wrench.rotation.z = angle
      wrench.scale.setScalar(scale)
      scene.add(wrench)
    }
    addWrench(3.4, 3.15, 0.12)
    addWrench(4.7, 3.15, -0.12)

    const addScrewdriver = (
      x: number,
      y: number,
      color: number,
      angle: number,
    ) => {
      const screwdriver = new THREE.Group()
      const gripMat = standard({ color, roughness: 0.55 })
      const grip = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.065, 0.055, 0.26, 12)),
        gripMat,
      )
      grip.position.y = 0.12
      const shaft = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.018, 0.018, 0.44, 10)),
        steelMat,
      )
      shaft.position.y = -0.22
      screwdriver.add(grip, shaft)
      screwdriver.position.set(x, y, -6.76)
      screwdriver.rotation.z = angle
      scene.add(screwdriver)
    }
    addScrewdriver(3.78, 2.55, 0xc23b28, 0.08)
    addScrewdriver(4.28, 2.55, 0x24425e, -0.08)

    const hammer = new THREE.Group()
    const hammerHandle = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.032, 0.038, 0.68, 10)),
      standard({ color: 0x8a5a33, roughness: 0.85 }),
    )
    const hammerHead = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.34, 0.1, 0.1)),
      steelMat,
    )
    hammerHead.position.y = 0.32
    hammer.add(hammerHandle, hammerHead)
    hammer.position.set(4.95, 2.55, -6.76)
    hammer.rotation.z = -0.15
    scene.add(hammer)

    const pliers = new THREE.Group()
    const plierGeo = track(new THREE.BoxGeometry(0.045, 0.62, 0.035))
    const leftHalf = new THREE.Mesh(plierGeo, steelMat)
    leftHalf.rotation.z = 0.22
    leftHalf.position.set(-0.04, -0.02, 0)
    const rightHalf = new THREE.Mesh(plierGeo, steelMat)
    rightHalf.rotation.z = -0.22
    rightHalf.position.set(0.04, -0.02, 0)
    pliers.add(leftHalf, rightHalf)
    pliers.position.set(3.05, 2.3, -6.76)
    pliers.rotation.z = 0.1
    scene.add(pliers)

    const cabinetMat = standard({
      color: 0xa83324,
      roughness: 0.5,
      metalness: 0.45,
    })
    const cabinet = new THREE.Group()
    cabinet.position.set(4.0, 0, -3.3)
    cabinet.rotation.y = -0.12
    scene.add(cabinet)

    const cabinetBody = new THREE.Mesh(
      track(new THREE.BoxGeometry(1.65, 1.05, 0.68)),
      cabinetMat,
    )
    cabinetBody.position.y = 0.63
    cabinetBody.castShadow = true
    cabinetBody.receiveShadow = true
    cabinet.add(cabinetBody)

    const drawerGeo = track(new THREE.BoxGeometry(1.5, 0.26, 0.045))
    const handleGeo = track(new THREE.BoxGeometry(0.42, 0.045, 0.055))
    for (let i = 0; i < 3; i += 1) {
      const drawer = new THREE.Mesh(drawerGeo, chestDark)
      drawer.position.set(0, 0.36 + i * 0.29, 0.36)
      cabinet.add(drawer)

      const handle = new THREE.Mesh(handleGeo, steelMat)
      handle.position.set(0, 0.36 + i * 0.29, 0.4)
      cabinet.add(handle)
    }

    const cabinetLegGeo = track(new THREE.BoxGeometry(0.08, 0.18, 0.08))
    const cabinetLegSpots: Array<[number, number]> = [
      [-0.7, -0.24],
      [0.7, -0.24],
      [-0.7, 0.24],
      [0.7, 0.24],
    ]
    cabinetLegSpots.forEach(([x, z]) => {
      const leg = new THREE.Mesh(cabinetLegGeo, legMat)
      leg.position.set(x, 0.09, z)
      leg.castShadow = true
      cabinet.add(leg)
    })

    const topTool = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.06, 0.78, 0.04)),
      steelMat,
    )
    topTool.position.set(-0.32, 1.22, 0.05)
    topTool.rotation.z = Math.PI / 2
    cabinet.add(topTool)

    const topSocket = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.13, 0.13, 0.22, 6)),
      steelMat,
    )
    topSocket.position.set(0.42, 1.25, -0.05)
    cabinet.add(topSocket)

    // --- Oil drums ----------------------------------------------------------
    const drumMat = standard({
      color: 0x24425e,
      roughness: 0.55,
      metalness: 0.5,
    })
    const drumGeo = track(new THREE.CylinderGeometry(0.31, 0.31, 0.92, 28))
    const drumSpots: Array<[number, number]> = [
      [4.75, -2.55],
      [5.2, -2.15],
    ]
    drumSpots.forEach(([x, z], index) => {
      const drum = new THREE.Mesh(drumGeo, drumMat)
      drum.position.set(x, 0.46, z)
      drum.rotation.y = index * 0.6
      drum.castShadow = true
      drum.receiveShadow = true
      props.add(drum)

      const drumBand = new THREE.Mesh(
        track(new THREE.TorusGeometry(0.315, 0.018, 8, 28)),
        standard({ color: 0x16283a, roughness: 0.6, metalness: 0.55 }),
      )
      drumBand.rotation.x = Math.PI / 2
      drumBand.position.set(x, 0.7, z)
      props.add(drumBand)
    })

    // --- Hydraulic jack -----------------------------------------------------
    const jackMat = standard({
      color: 0xc23b28,
      roughness: 0.55,
      metalness: 0.5,
    })
    const jack = new THREE.Group()
    jack.position.set(3.4, 0, -2.6)
    jack.rotation.y = -0.5
    scene.add(jack)

    const jackBase = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.9, 0.16, 0.42)),
      jackMat,
    )
    jackBase.position.y = 0.08
    jackBase.castShadow = true
    jack.add(jackBase)

    const jackArm = new THREE.Mesh(
      track(new THREE.BoxGeometry(0.8, 0.08, 0.14)),
      jackMat,
    )
    jackArm.position.set(0.1, 0.4, 0)
    jackArm.rotation.z = 0.42
    jackArm.castShadow = true
    jack.add(jackArm)

    const jackHandle = new THREE.Mesh(
      track(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 10)),
      legMat,
    )
    jackHandle.position.set(-0.2, 0.6, 0)
    jackHandle.rotation.z = 0.5
    jack.add(jackHandle)

    // --- Overhead lamps -----------------------------------------------------
    const lampHousingMat = standard({
      color: 0x181513,
      roughness: 0.6,
      metalness: 0.6,
    })
    const lampGlowMat = track(
      new THREE.MeshBasicMaterial({ color: 0xffe2b5, toneMapped: false }),
    )
    const coneMat = track(
      new THREE.MeshBasicMaterial({
        color: 0xffd39a,
        transparent: true,
        opacity: 0.045,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    )
    const spotlightTargets: THREE.SpotLight[] = []
    const lampPositions: Array<[number, number]> = [
      [-2.7, 0.6],
      [0, 0.9],
      [2.7, 0.6],
    ]
    lampPositions.forEach(([x, z], index) => {
      const housing = new THREE.Mesh(
        track(new THREE.ConeGeometry(0.3, 0.34, 20, 1, true)),
        lampHousingMat,
      )
      housing.position.set(x, 5.3, z)
      housing.rotation.x = Math.PI
      scene.add(housing)

      const bulb = new THREE.Mesh(
        track(new THREE.CircleGeometry(0.19, 20)),
        lampGlowMat,
      )
      bulb.rotation.x = Math.PI / 2
      bulb.position.set(x, 5.14, z)
      scene.add(bulb)

      const cone = new THREE.Mesh(
        track(new THREE.ConeGeometry(1.5, 4.6, 28, 1, true)),
        coneMat,
      )
      cone.position.set(x, 2.85, z)
      scene.add(cone)

      const spot = new THREE.SpotLight(
        0xffd2a0,
        index === 1 ? 34 : 20,
        16,
        0.55,
        0.55,
        1.4,
      )
      spot.position.set(x, 5.15, z)
      spot.target.position.set(x * 0.4, 0, z * 0.4)
      if (index === 1) {
        spot.castShadow = true
        spot.shadow.mapSize.width = 1024
        spot.shadow.mapSize.height = 1024
        spot.shadow.bias = -0.0015
      }
      scene.add(spot)
      scene.add(spot.target)
      spotlightTargets.push(spot)
    })

    // --- Ambient lighting ---------------------------------------------------
    scene.add(new THREE.AmbientLight(0xffe9d1, 0.42))

    const coolRim = new THREE.DirectionalLight(0x9fc6ff, 0.55)
    coolRim.position.set(-6, 5, 4)
    scene.add(coolRim)

    const warmAccent = new THREE.PointLight(0xff7a3a, 7, 9, 2)
    warmAccent.position.set(-4.2, 1.5, 3.2)
    scene.add(warmAccent)

    const backFill = new THREE.PointLight(0xffc38a, 4, 10, 2)
    backFill.position.set(2.8, 2.2, -4.6)
    scene.add(backFill)

    // --- Dust motes ---------------------------------------------------------
    const dustCount = 160
    const dustPositions = new Float32Array(dustCount * 3)
    const dustSpeeds = new Float32Array(dustCount)
    for (let i = 0; i < dustCount; i += 1) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 14
      dustPositions[i * 3 + 1] = 0.3 + Math.random() * 4.6
      dustPositions[i * 3 + 2] = -6.4 + Math.random() * 10.5
      dustSpeeds[i] = 0.05 + Math.random() * 0.12
    }
    const dustGeo = track(new THREE.BufferGeometry())
    dustGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3),
    )
    const dust = new THREE.Points(
      dustGeo,
      track(
        new THREE.PointsMaterial({
          color: 0xffd9b0,
          size: 0.035,
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      ),
    )
    scene.add(dust)

    // --- Car ----------------------------------------------------------------
    const carGroup = new THREE.Group()
    carGroup.position.y = 0.18
    scene.add(carGroup)

    let raf = 0
    let last = performance.now()
    let disposed = false

    const loader = new GLTFLoader()
    loader.load(
      "/models/jaguar_grigia.glb",
      (gltf) => {
        if (disposed) return
        const model = gltf.scene
        normalizeLoadedCar(model)
        model.traverse((obj) => {
          const mesh = obj as THREE.Mesh
          if (mesh.isMesh) {
            const mats = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material]
            mats.forEach((m) => track(m))
          }
        })
        carGroup.add(model)
      },
      undefined,
      (err) => {
        if (disposed) return
        console.error("Errore caricamento modello auto:", err)
      },
    )

    // --- Pointer parallax ---------------------------------------------------
    const pointer = { x: 0, y: 0 }
    const pointerTarget = { x: 0, y: 0 }
    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      pointerTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointerTarget.y = ((event.clientY - rect.top) / rect.height) * 2 - 1
    }
    const onPointerLeave = () => {
      pointerTarget.x = 0
      pointerTarget.y = 0
    }
    if (!reduced) {
      container.addEventListener("pointermove", onPointerMove)
      container.addEventListener("pointerleave", onPointerLeave)
    }

    // --- Resize -------------------------------------------------------------
    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      const w = Math.max(1, Math.floor(width))
      const h = Math.max(1, Math.floor(height))
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(container)
    resize()

    // --- Loop ---------------------------------------------------------------
    const animate = (now: number) => {
      raf = window.requestAnimationFrame(animate)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      if (!reduced) {
        pointer.x += (pointerTarget.x - pointer.x) * 0.05
        pointer.y += (pointerTarget.y - pointer.y) * 0.05

        const sway = Math.sin(now * 0.00018) * 0.06
        const angle = baseAngle + sway + pointer.x * 0.08
        camera.position.x = Math.sin(angle) * cameraRadius
        camera.position.z = Math.cos(angle) * cameraRadius
        camera.position.y = 2.45 - pointer.y * 0.24
        camera.lookAt(0.1, 0.88, 0)

        carGroup.rotation.y += dt * 0.1

        const position = dustGeo.getAttribute(
          "position",
        ) as THREE.BufferAttribute
        const array = position.array as Float32Array
        for (let i = 0; i < dustCount; i += 1) {
          array[i * 3 + 1] += dustSpeeds[i] * dt
          if (array[i * 3 + 1] > 5.2) array[i * 3 + 1] = 0.25
        }
        position.needsUpdate = true
      }

      spotlightTargets.forEach((spot, index) => {
        spot.intensity =
          (index === 1 ? 34 : 20) + Math.sin(now * 0.001 + index) * 0.9
      })

      renderer.render(scene, camera)
    }

    raf = window.requestAnimationFrame(animate)

    return () => {
      disposed = true
      window.cancelAnimationFrame(raf)
      ro.disconnect()
      container.removeEventListener("pointermove", onPointerMove)
      container.removeEventListener("pointerleave", onPointerLeave)
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          const mats = Array.isArray(obj.material)
            ? obj.material
            : [obj.material]
          mats.forEach((m) => m.dispose())
        }
      })
      disposables.forEach((item) => item.dispose())
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="workshop-scene">
      <div
        className="workshop-scene__viewport"
        ref={containerRef}
        aria-hidden="true"
      />
    </div>
  )
}
