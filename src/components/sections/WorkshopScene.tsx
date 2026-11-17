import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

type Puff = {
  sprite: THREE.Sprite
  velocity: THREE.Vector3
  life: number
  maxLife: number
}

function createTextTexture(text: string) {
  const canvas = document.createElement("canvas")
  canvas.width = 1536
  canvas.height = 320
  const ctx = canvas.getContext("2d")
  if (!ctx) return new THREE.CanvasTexture(canvas)

  const lines = ['Angelo Petito per gli amici', '"Robb e Nott"']
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  const drawLine = (line: string, y: number, font: string) => {
    ctx.font = font
    ctx.lineJoin = "round"
    ctx.lineWidth = 10
    ctx.strokeStyle = "rgba(20, 12, 8, 0.85)"
    ctx.strokeText(line, canvas.width / 2, y)
    ctx.shadowColor = "rgba(255, 170, 70, 0.45)"
    ctx.shadowBlur = 14
    ctx.fillStyle = "rgba(255, 250, 242, 1)"
    ctx.fillText(line, canvas.width / 2, y)
    ctx.shadowBlur = 0
  }

  drawLine(lines[0], canvas.height / 2 - 40, "700 66px Georgia, serif")
  drawLine(lines[1], canvas.height / 2 + 46, "700 80px Georgia, serif")

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function normalizeLoadedCar(root: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(root)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  const maxDim = Math.max(size.x, size.y, size.z) || 1
  const target = 3.8
  const scale = target / maxDim
  root.scale.setScalar(scale)

  // Recompute after scaling
  box.setFromObject(root)
  box.getCenter(center)
  root.position.x += -center.x
  root.position.z += -center.z
  root.position.y += -box.min.y

  // Heuristic orientation: most car models face +Z or -Z; align roughly toward +X for our camera
  root.rotation.y = -Math.PI / 2

  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })
}

function findExhaustAnchor(root: THREE.Object3D) {
  let found: THREE.Object3D | null = null
  root.traverse((obj) => {
    if (found) return
    const n = obj.name.toLowerCase()
    if (
      n.includes("exhaust") ||
      n.includes("muffler") ||
      n.includes("scarico") ||
      n.includes("tailpipe") ||
      n.includes("pipe") ||
      n.includes("silencer")
    ) {
      found = obj
    }
  })
  if (found) return found

  const box = new THREE.Box3().setFromObject(root)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const anchor = new THREE.Object3D()
  // Fallback: low rear corner area, slightly outside body so puffs are visible
  anchor.position.set(box.min.x - size.x * 0.02, box.min.y + size.y * 0.22, center.z - size.z * 0.2)
  root.add(anchor)
  return anchor
}

function createDoorTextTexture(text: string) {
  const canvas = document.createElement("canvas")
  canvas.width = 2048
  canvas.height = 640
  const ctx = canvas.getContext("2d")
  if (!ctx) return new THREE.CanvasTexture(canvas)

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.lineJoin = "round"
  ctx.font = "900 240px Arial, sans-serif"
  ctx.lineWidth = 28
  ctx.strokeStyle = "rgba(0, 0, 0, 0.98)"
  ctx.strokeText(text, canvas.width / 2, canvas.height / 2)
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)"
  ctx.shadowBlur = 10
  ctx.fillStyle = "#ffffff"
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  return texture
}

function createDoorLabel(text: string, opts: { width?: number; height?: number } = {}) {
  const texture = createDoorTextTexture(text)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  })
  const geometry = new THREE.PlaneGeometry(opts.width ?? 1.35, opts.height ?? 0.32)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.renderOrder = 20
  mesh.name = `door-label-${text}`
  return mesh
}

function addDoorLabels(carGroup: THREE.Group, model: THREE.Object3D): Array<{ mesh: THREE.Mesh; radius: number; angle: number; y: number; cx: number; cz: number }> {
  // --- CONFIGURAZIONE REGOLABILE ---
  const LEFT_TEXT = "Angelo Petito" // esatto
  const RIGHT_TEXT = "Detto Robb e Nott" // esatto

  carGroup.updateMatrixWorld(true)
  model.updateMatrixWorld(true)
  const worldBox = new THREE.Box3().setFromObject(carGroup)
  const worldSize = worldBox.getSize(new THREE.Vector3())
  const worldCenter = worldBox.getCenter(new THREE.Vector3())
  const localCenter = carGroup.worldToLocal(worldCenter.clone())

  const leftLabel = createDoorLabel(LEFT_TEXT, { width: 2.4, height: 0.62 })
  const rightLabel = createDoorLabel(RIGHT_TEXT, { width: 2.9, height: 0.62 })

  const radius = Math.max(worldSize.x, worldSize.z) * 0.72
  const y = localCenter.y + worldSize.y * 0.05
  const cx = localCenter.x
  const cz = localCenter.z

  const left = { mesh: leftLabel, radius, angle: Math.PI / 2, y, cx, cz }
  const right = { mesh: rightLabel, radius, angle: -Math.PI / 2, y, cx, cz }

  leftLabel.position.set(cx + Math.cos(left.angle) * radius, y, cz + Math.sin(left.angle) * radius)
  rightLabel.position.set(cx + Math.cos(right.angle) * radius, y, cz + Math.sin(right.angle) * radius)
  leftLabel.scale.set(1, 1, 1)
  rightLabel.scale.set(1, 1, 1)

  carGroup.add(leftLabel)
  carGroup.add(rightLabel)
  return [left, right]
}

export function WorkshopScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [repaired, setRepaired] = useState(false)
  const [repairing, setRepairing] = useState(false)
  const [engineOn, setEngineOn] = useState(false)
  const [progress, setProgress] = useState(0)
  const [modelReady, setModelReady] = useState(false)
  const [modelError, setModelError] = useState<string | null>(null)

  const repairedRef = useRef(repaired)
  const engineOnRef = useRef(engineOn)
  const repairingRef = useRef(repairing)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const repairIntervalRef = useRef<number | null>(null)
  const engineIntervalRef = useRef<number | null>(null)
  const engineNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode; lfo: OscillatorNode; lfoGain: GainNode } | null>(null)
  const doorLabelsRef = useRef<Array<{ mesh: THREE.Mesh; radius: number; angle: number; y: number; cx: number; cz: number }>>([])

  useEffect(() => {
    repairedRef.current = repaired
  }, [repaired])
  useEffect(() => {
    engineOnRef.current = engineOn
  }, [engineOn])
  useEffect(() => {
    repairingRef.current = repairing
  }, [repairing])

  const ensureAudio = () => {
    if (typeof window === "undefined") return null
    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return null
    if (!audioCtxRef.current) audioCtxRef.current = new Ctx()
    if (audioCtxRef.current.state === "suspended") {
      void audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  const playRepairTick = () => {
    const ctx = ensureAudio()
    if (!ctx) return
    const now = ctx.currentTime
    const variant = Math.random()

    if (variant < 0.45) {
      // Impact wrench / ratchet clicks
      const clicks = 2 + Math.floor(Math.random() * 4)
      for (let i = 0; i < clicks; i++) {
        const t = now + i * (0.045 + Math.random() * 0.03)
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        const bp = ctx.createBiquadFilter()
        osc.type = "square"
        const f = 900 + Math.random() * 1400
        osc.frequency.setValueAtTime(f, t)
        osc.frequency.exponentialRampToValueAtTime(220, t + 0.03)
        bp.type = "bandpass"
        bp.frequency.setValueAtTime(1200 + Math.random() * 900, t)
        bp.Q.value = 2.5
        gain.gain.setValueAtTime(0.0001, t)
        gain.gain.exponentialRampToValueAtTime(0.09, t + 0.002)
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
        osc.connect(bp)
        bp.connect(gain)
        gain.connect(ctx.destination)
        osc.start(t)
        osc.stop(t + 0.06)
      }
    } else if (variant < 0.75) {
      // Metallic clank / tool drop
      const osc = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()
      const bp = ctx.createBiquadFilter()
      const base = 220 + Math.random() * 380
      osc.type = "triangle"
      osc.frequency.setValueAtTime(base, now)
      osc.frequency.exponentialRampToValueAtTime(base * 0.45, now + 0.22)
      osc2.type = "sine"
      osc2.frequency.setValueAtTime(base * 2.1, now)
      osc2.frequency.exponentialRampToValueAtTime(base * 0.9, now + 0.18)
      bp.type = "bandpass"
      bp.frequency.setValueAtTime(900 + Math.random() * 1000, now)
      bp.Q.value = 1.1
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.14, now + 0.004)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28)
      osc.connect(bp)
      osc2.connect(bp)
      bp.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc2.start(now)
      osc.stop(now + 0.3)
      osc2.stop(now + 0.25)
    } else {
      // Air tool / grinder-like burst
      const len = Math.floor(ctx.sampleRate * 0.22)
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < len; i++) {
        const env = Math.min(1, i / (ctx.sampleRate * 0.03)) * Math.pow(1 - i / len, 1.2)
        data[i] = (Math.random() * 2 - 1) * env
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      const hp = ctx.createBiquadFilter()
      hp.type = "highpass"
      hp.frequency.setValueAtTime(1200, now)
      const bp = ctx.createBiquadFilter()
      bp.type = "bandpass"
      bp.frequency.setValueAtTime(2400 + Math.random() * 1200, now)
      bp.Q.value = 0.9
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(0.07, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)
      noise.connect(hp)
      hp.connect(bp)
      bp.connect(gain)
      gain.connect(ctx.destination)
      noise.start(now)
    }

    // Low thud/body resonance
    const thud = ctx.createOscillator()
    const tGain = ctx.createGain()
    thud.type = "sine"
    thud.frequency.setValueAtTime(90 + Math.random() * 40, now)
    thud.frequency.exponentialRampToValueAtTime(45, now + 0.12)
    tGain.gain.setValueAtTime(0.0001, now)
    tGain.gain.exponentialRampToValueAtTime(0.05, now + 0.01)
    tGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16)
    thud.connect(tGain)
    tGain.connect(ctx.destination)
    thud.start(now)
    thud.stop(now + 0.18)
  }

  const startRepairAudio = () => {
    if (repairIntervalRef.current != null) return
    playRepairTick()
    repairIntervalRef.current = window.setInterval(() => {
      playRepairTick()
      if (Math.random() > 0.45) window.setTimeout(playRepairTick, 60 + Math.random() * 120)
      if (Math.random() > 0.8) window.setTimeout(playRepairTick, 160 + Math.random() * 120)
    }, 240)
  }

  const stopRepairAudio = () => {
    if (repairIntervalRef.current != null) {
      window.clearInterval(repairIntervalRef.current)
      repairIntervalRef.current = null
    }
  }

  const playEnginePop = (intensity = 1) => {
    const ctx = ensureAudio()
    if (!ctx) return
    const now = ctx.currentTime

    const len = Math.floor(ctx.sampleRate * 0.08)
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < len; i++) {
      const env = Math.pow(1 - i / len, 2.2)
      data[i] = (Math.random() * 2 - 1) * env
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const bp = ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.frequency.setValueAtTime(700 + Math.random() * 1800, now)
    bp.Q.value = 0.8
    const hp = ctx.createBiquadFilter()
    hp.type = "highpass"
    hp.frequency.value = 250
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.12 * intensity, now + 0.003)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)
    noise.connect(hp)
    hp.connect(bp)
    bp.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)

    const thump = ctx.createOscillator()
    const tGain = ctx.createGain()
    thump.type = "triangle"
    thump.frequency.setValueAtTime(120 + Math.random() * 60, now)
    thump.frequency.exponentialRampToValueAtTime(45, now + 0.07)
    tGain.gain.setValueAtTime(0.0001, now)
    tGain.gain.exponentialRampToValueAtTime(0.06 * intensity, now + 0.004)
    tGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)
    thump.connect(tGain)
    tGain.connect(ctx.destination)
    thump.start(now)
    thump.stop(now + 0.09)
  }

  const startEngineAudio = () => {
    if (engineNodesRef.current) return
    const ctx = ensureAudio()
    if (!ctx) return
    const now = ctx.currentTime

    const master = ctx.createGain()
    master.gain.setValueAtTime(0.0001, now)
    master.gain.exponentialRampToValueAtTime(0.32, now + 0.08) // crank/start burst
    master.gain.exponentialRampToValueAtTime(0.16, now + 0.45)
    master.gain.exponentialRampToValueAtTime(0.17, now + 1.2)
    master.gain.exponentialRampToValueAtTime(0.14, now + 2.4)
    master.connect(ctx.destination)

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = "lowpass"
    lowpass.frequency.setValueAtTime(320, now)
    lowpass.frequency.exponentialRampToValueAtTime(1400, now + 0.35)
    lowpass.frequency.exponentialRampToValueAtTime(900, now + 1.1)
    lowpass.frequency.exponentialRampToValueAtTime(700, now + 2.2)
    lowpass.Q.value = 0.9
    lowpass.connect(master)

    const waveshaper = ctx.createWaveShaper()
    const curve = new Float32Array(256)
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * 2 - 1
      curve[i] = Math.tanh(2.6 * x)
    }
    waveshaper.curve = curve
    waveshaper.oversample = "2x"
    waveshaper.connect(lowpass)

    const body = ctx.createGain()
    body.gain.value = 1.0
    body.connect(waveshaper)

    // Deep rumble base
    const sub = ctx.createOscillator()
    sub.type = "sine"
    sub.frequency.setValueAtTime(26, now)
    sub.frequency.exponentialRampToValueAtTime(85, now + 0.35)
    sub.frequency.exponentialRampToValueAtTime(65, now + 1.1)
    sub.frequency.exponentialRampToValueAtTime(45, now + 2.2)
    const subGain = ctx.createGain()
    subGain.gain.value = 0.6

    const osc1 = ctx.createOscillator()
    osc1.type = "sawtooth"
    osc1.frequency.setValueAtTime(34, now)
    osc1.frequency.exponentialRampToValueAtTime(130, now + 0.35) // su di giri
    osc1.frequency.exponentialRampToValueAtTime(95, now + 1.1)
    osc1.frequency.exponentialRampToValueAtTime(58, now + 2.3)

    const osc2 = ctx.createOscillator()
    osc2.type = "square"
    osc2.frequency.setValueAtTime(68, now)
    osc2.frequency.exponentialRampToValueAtTime(260, now + 0.35)
    osc2.frequency.exponentialRampToValueAtTime(190, now + 1.1)
    osc2.frequency.exponentialRampToValueAtTime(116, now + 2.3)
    const osc2Gain = ctx.createGain()
    osc2Gain.gain.value = 0.3

    const osc3 = ctx.createOscillator()
    osc3.type = "triangle"
    osc3.frequency.setValueAtTime(102, now)
    osc3.frequency.exponentialRampToValueAtTime(390, now + 0.35)
    osc3.frequency.exponentialRampToValueAtTime(285, now + 1.1)
    osc3.frequency.exponentialRampToValueAtTime(174, now + 2.3)
    const osc3Gain = ctx.createGain()
    osc3Gain.gain.value = 0.16

    // Cylinder pulse / firing throb
    const pulse = ctx.createOscillator()
    pulse.type = "square"
    pulse.frequency.setValueAtTime(18, now)
    pulse.frequency.linearRampToValueAtTime(28, now + 0.4) // accelera
    pulse.frequency.linearRampToValueAtTime(14, now + 2.0)
    const pulseGain = ctx.createGain()
    pulseGain.gain.setValueAtTime(0.4, now)
    pulseGain.gain.linearRampToValueAtTime(0.22, now + 1.8)
    const pulseOffset = ctx.createConstantSource()
    pulseOffset.offset.setValueAtTime(0.7, now)
    const pulseMix = ctx.createGain()
    pulseMix.gain.value = 1
    pulse.connect(pulseGain)
    pulseGain.connect(pulseMix.gain)
    pulseOffset.connect(pulseMix.gain)
    pulseMix.connect(body.gain)

    // Rev flutter / instability (scoppiettio feel)
    const flutter = ctx.createOscillator()
    flutter.type = "sawtooth"
    flutter.frequency.setValueAtTime(9, now)
    flutter.frequency.linearRampToValueAtTime(5.5, now + 2.0)
    const flutterGain = ctx.createGain()
    flutterGain.gain.setValueAtTime(24, now)
    flutterGain.gain.linearRampToValueAtTime(10, now + 2.0)
    flutter.connect(flutterGain)
    flutterGain.connect(osc1.frequency)
    flutterGain.connect(osc2.frequency)

    const lfo = ctx.createOscillator()
    lfo.type = "sine"
    lfo.frequency.setValueAtTime(11, now)
    lfo.frequency.linearRampToValueAtTime(7.5, now + 1.8)
    const lfoGain = ctx.createGain()
    lfoGain.gain.setValueAtTime(20, now)
    lfoGain.gain.linearRampToValueAtTime(8, now + 1.8)
    lfo.connect(lfoGain)
    lfoGain.connect(osc1.frequency)
    const lfoGain2 = ctx.createGain()
    lfoGain2.gain.setValueAtTime(28, now)
    lfoGain2.gain.linearRampToValueAtTime(10, now + 1.8)
    lfo.connect(lfoGain2)
    lfoGain2.connect(osc2.frequency)

    const rumbleGain = ctx.createGain()
    rumbleGain.gain.value = 0.9
    sub.connect(subGain)
    subGain.connect(rumbleGain)
    osc1.connect(rumbleGain)
    osc2.connect(osc2Gain)
    osc2Gain.connect(rumbleGain)
    osc3.connect(osc3Gain)
    osc3Gain.connect(rumbleGain)
    rumbleGain.connect(body)

    // Exhaust growl noise
    const nLen = Math.floor(ctx.sampleRate * 2.0)
    const nBuf = ctx.createBuffer(1, nLen, ctx.sampleRate)
    const nd = nBuf.getChannelData(0)
    for (let i = 0; i < nLen; i++) nd[i] = Math.random() * 2 - 1
    const nSrc = ctx.createBufferSource()
    nSrc.buffer = nBuf
    nSrc.loop = true
    const nBp = ctx.createBiquadFilter()
    nBp.type = "bandpass"
    nBp.frequency.setValueAtTime(140, now)
    nBp.frequency.exponentialRampToValueAtTime(520, now + 0.4)
    nBp.frequency.exponentialRampToValueAtTime(320, now + 1.8)
    nBp.Q.value = 1.0
    const nLp = ctx.createBiquadFilter()
    nLp.type = "lowpass"
    nLp.frequency.value = 900
    const nGain = ctx.createGain()
    nGain.gain.setValueAtTime(0.16, now)
    nGain.gain.exponentialRampToValueAtTime(0.09, now + 0.5)
    nGain.gain.exponentialRampToValueAtTime(0.06, now + 2.0)
    nSrc.connect(nBp)
    nBp.connect(nLp)
    nLp.connect(nGain)
    nGain.connect(lowpass)

    // Starter/crank burst
    const cLen = Math.floor(ctx.sampleRate * 0.6)
    const cBuf = ctx.createBuffer(1, cLen, ctx.sampleRate)
    const cd = cBuf.getChannelData(0)
    for (let i = 0; i < cLen; i++) cd[i] = (Math.random() * 2 - 1) * (1 - i / cLen)
    const cSrc = ctx.createBufferSource()
    cSrc.buffer = cBuf
    const cBp = ctx.createBiquadFilter()
    cBp.type = "bandpass"
    cBp.frequency.setValueAtTime(220, now)
    cBp.frequency.exponentialRampToValueAtTime(900, now + 0.3)
    cBp.Q.value = 1.1
    const cGain = ctx.createGain()
    cGain.gain.setValueAtTime(0.26, now)
    cGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)
    cSrc.connect(cBp)
    cBp.connect(cGain)
    cGain.connect(master)

    sub.start(now)
    osc1.start(now)
    osc2.start(now)
    osc3.start(now)
    pulse.start(now)
    pulseOffset.start(now)
    flutter.start(now)
    lfo.start(now)
    nSrc.start(now)
    cSrc.start(now)

    engineNodesRef.current = { osc: osc1, gain: master, lfo, lfoGain }
    ;(engineNodesRef.current as any).sub = sub
    ;(engineNodesRef.current as any).osc2 = osc2
    ;(engineNodesRef.current as any).osc3 = osc3
    ;(engineNodesRef.current as any).osc2Gain = osc2Gain
    ;(engineNodesRef.current as any).osc3Gain = osc3Gain
    ;(engineNodesRef.current as any).pulse = pulse
    ;(engineNodesRef.current as any).pulseGain = pulseGain
    ;(engineNodesRef.current as any).pulseOffset = pulseOffset
    ;(engineNodesRef.current as any).flutter = flutter
    ;(engineNodesRef.current as any).flutterGain = flutterGain
    ;(engineNodesRef.current as any).lfoGain2 = lfoGain2
    ;(engineNodesRef.current as any).nSrc = nSrc
    ;(engineNodesRef.current as any).cSrc = cSrc

    // Scoppiettii/sputter mentre va su di giri e al minimo
    playEnginePop(1.1)
    if (engineIntervalRef.current != null) window.clearInterval(engineIntervalRef.current)
    engineIntervalRef.current = window.setInterval(() => {
      if (!engineOnRef.current) return
      playEnginePop(0.7 + Math.random() * 0.8)
      if (Math.random() > 0.55) {
        window.setTimeout(() => {
          if (engineOnRef.current) playEnginePop(0.5 + Math.random() * 0.7)
        }, 40 + Math.random() * 90)
      }
    }, 180)
  }

  const stopEngineAudio = () => {
    if (engineIntervalRef.current != null) {
      window.clearInterval(engineIntervalRef.current)
      engineIntervalRef.current = null
    }
    const nodes = engineNodesRef.current as any
    const ctx = audioCtxRef.current
    if (!nodes || !ctx) return
    const now = ctx.currentTime
    nodes.gain.gain.cancelScheduledValues(now)
    nodes.gain.gain.setValueAtTime(Math.max(nodes.gain.gain.value, 0.0001), now)
    nodes.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)
    const stopAt = now + 0.55
    try { nodes.sub?.stop(stopAt) } catch {}
    try { nodes.osc.stop(stopAt) } catch {}
    try { nodes.osc2?.stop(stopAt) } catch {}
    try { nodes.osc3?.stop(stopAt) } catch {}
    try { nodes.pulse?.stop(stopAt) } catch {}
    try { nodes.pulseOffset?.stop(stopAt) } catch {}
    try { nodes.flutter?.stop(stopAt) } catch {}
    try { nodes.lfo.stop(stopAt) } catch {}
    try { nodes.nSrc?.stop(stopAt) } catch {}
    try { nodes.cSrc?.stop(now + 0.1) } catch {}
    engineNodesRef.current = null
  }

  useEffect(() => {
    if (repairing) startRepairAudio()
    else stopRepairAudio()
    return () => stopRepairAudio()
  }, [repairing])

  useEffect(() => {
    if (engineOn) startEngineAudio()
    else stopEngineAudio()
    return () => stopEngineAudio()
  }, [engineOn])

  useEffect(() => {
    return () => {
      stopRepairAudio()
      stopEngineAudio()
      if (audioCtxRef.current) {
        void audioCtxRef.current.close()
        audioCtxRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x171311)
    scene.fog = new THREE.Fog(0x171311, 8, 18)

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(4.8, 2.8, 5.6)
    camera.lookAt(0, 0.6, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xfff1e6, 0.6)
    scene.add(ambient)

    const keyLight = new THREE.SpotLight(0xffd7a8, 22, 20, Math.PI / 5, 0.45, 1)
    keyLight.position.set(2, 6, 4)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    keyLight.target.position.set(0, 0.5, 0)
    scene.add(keyLight)
    scene.add(keyLight.target)

    const fillLight = new THREE.PointLight(0x7dd3fc, 5, 12)
    fillLight.position.set(-4, 2.5, -2)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8)
    rimLight.position.set(-3, 3, 5)
    scene.add(rimLight)

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({ color: 0x2a2522, roughness: 0.95, metalness: 0.05 }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(6.2, 0.18, 3.4),
      new THREE.MeshStandardMaterial({ color: 0x3a312c, roughness: 0.8 }),
    )
    platform.position.y = 0.09
    platform.receiveShadow = true
    scene.add(platform)

    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 8),
      new THREE.MeshStandardMaterial({ color: 0x1f1a18, roughness: 1 }),
    )
    wall.position.set(0, 3.2, -4)
    scene.add(wall)

    const carGroup = new THREE.Group()
    carGroup.position.y = 0.18
    scene.add(carGroup)

    const exhaustWorld = new THREE.Vector3()
    let exhaustObj: THREE.Object3D | null = null
    const headlightMats: THREE.MeshStandardMaterial[] = []

    const textTexture = createTextTexture('Angelo Petito per gli amici "Robb e Nott"')
    const puffs: Puff[] = []
    let raf = 0
    let last = performance.now()
    let emitAccumulator = 0
    let disposed = false

    const loader = new GLTFLoader()
    loader.load(
      "/models/jaguar_grigia.glb",
      (gltf) => {
        if (disposed) return
        const model = gltf.scene
        normalizeLoadedCar(model)
        carGroup.add(model)
        exhaustObj = findExhaustAnchor(model)
        doorLabelsRef.current = addDoorLabels(carGroup, model)

        model.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh
            const name = mesh.name.toLowerCase()
            if (name.includes("head") || name.includes("light") || name.includes("lamp") || name.includes("faro")) {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
              mats.forEach((m) => {
                if (m && "emissive" in m) headlightMats.push(m as THREE.MeshStandardMaterial)
              })
            }
          }
        })
        setModelReady(true)
      },
      undefined,
      (err) => {
        if (disposed) return
        console.error("Errore caricamento modello auto:", err)
        setModelError("Impossibile caricare il modello 3D dell’auto.")
      },
    )

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

    const emitPuff = () => {
      if (!exhaustObj) return
      exhaustObj.getWorldPosition(exhaustWorld)

      const carCenter = new THREE.Vector3()
      carGroup.getWorldPosition(carCenter)
      const outDir = exhaustWorld.clone().sub(carCenter)
      outDir.y = 0
      if (outDir.lengthSq() < 0.0001) outDir.set(-1, 0, 0)
      outDir.normalize()

      const material = new THREE.SpriteMaterial({
        map: textTexture,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        depthTest: false,
      })
      const sprite = new THREE.Sprite(material)
      sprite.renderOrder = 20
      sprite.position.copy(exhaustWorld).addScaledVector(outDir, 0.32)
      sprite.position.y += 0.06
      sprite.scale.set(0.04, 0.01, 1)
      scene.add(sprite)
      puffs.push({
        sprite,
        velocity: new THREE.Vector3(
          outDir.x * (0.7 + Math.random() * 0.35),
          0.18 + Math.random() * 0.16,
          outDir.z * (0.7 + Math.random() * 0.35) + (Math.random() - 0.5) * 0.08,
        ),
        life: 0,
        maxLife: 3.4 + Math.random() * 1.0,
      })
    }

    const animate = (now: number) => {
      raf = window.requestAnimationFrame(animate)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      if (!prefersReducedMotion) {
        const t = now * 0.0004
        camera.position.x = 4.8 + Math.sin(t) * 0.18
        camera.position.z = 5.6 + Math.cos(t) * 0.18
        camera.lookAt(0, 0.7, 0)

        if (engineOnRef.current) {
          carGroup.rotation.y += dt * 0.7
          carGroup.position.y = 0.18 + Math.sin(now * 0.03) * 0.008
          emitAccumulator += dt
          if (emitAccumulator > 0.55) {
            emitAccumulator = 0
            emitPuff()
          }
        } else if (repairingRef.current) {
          carGroup.rotation.y += dt * 0.35
          carGroup.position.y += (0.18 - carGroup.position.y) * 0.1
          emitAccumulator = 0
        } else {
          carGroup.rotation.y += dt * 0.12
          carGroup.position.y += (0.18 - carGroup.position.y) * 0.1
          emitAccumulator = 0
        }
      } else if (engineOnRef.current) {
        emitAccumulator += dt
        if (emitAccumulator > 1.4 && puffs.length < 3) {
          emitAccumulator = 0
          emitPuff()
        }
      }

      const headlightsOn = engineOnRef.current
      headlightMats.forEach((mat) => {
        mat.emissiveIntensity = headlightsOn ? 1.8 : (mat.emissiveIntensity || 0.2)
      })

      // Fai girare le scritte a cerchi attorno all'auto, sempre leggibili
      if (doorLabelsRef.current.length) {
        const camWorld = new THREE.Vector3()
        camera.getWorldPosition(camWorld)
        const t = prefersReducedMotion ? 0 : now * 0.00035
        doorLabelsRef.current.forEach((item) => {
          const a = item.angle + t
          item.mesh.position.set(
            item.cx + Math.cos(a) * item.radius,
            item.y,
            item.cz + Math.sin(a) * item.radius,
          )
          item.mesh.lookAt(camWorld)
        })
      }

      for (let i = puffs.length - 1; i >= 0; i--) {
        const puff = puffs[i]
        puff.life += dt
        puff.sprite.position.addScaledVector(puff.velocity, dt)
        const k = puff.life / puff.maxLife
        const scale = 2.2 + k * 1.4
        puff.sprite.scale.set(scale, scale * 0.22, 1)
        const mat = puff.sprite.material as THREE.SpriteMaterial
        mat.opacity = Math.max(0, 1 * (1 - k))
        if (puff.life >= puff.maxLife) {
          scene.remove(puff.sprite)
          mat.dispose()
          puffs.splice(i, 1)
        }
      }

      renderer.render(scene, camera)
    }

    raf = window.requestAnimationFrame(animate)

    return () => {
      disposed = true
      doorLabelsRef.current = []
      window.cancelAnimationFrame(raf)
      ro.disconnect()
      puffs.forEach((p) => {
        scene.remove(p.sprite)
        ;(p.sprite.material as THREE.SpriteMaterial).dispose()
      })
      textTexture.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => m && m.dispose())
        }
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  useEffect(() => {
    if (!repairing) return
    setProgress(0)
    let value = 0
    const id = window.setInterval(() => {
      value += 8
      if (value >= 100) {
        value = 100
        window.clearInterval(id)
        setRepairing(false)
        setRepaired(true)
      }
      setProgress(value)
    }, 180)
    return () => window.clearInterval(id)
  }, [repairing])

  const onRepair = () => {
    if (repairing || repaired) return
    setRepairing(true)
  }

  const onToggleEngine = () => {
    if (!repaired) return
    setEngineOn((v) => !v)
  }

  return (
    <div className="workshop-scene">
      <div className="workshop-scene__viewport" ref={containerRef} aria-hidden="true" />
      <div className="workshop-scene__hud" aria-live="polite">
        <p className="workshop-scene__status">
          {modelError && modelError}
          {!modelError && !modelReady && "Caricamento dell’auto 3D in corso…"}
          {!modelError && modelReady && !repaired && !repairing && "Auto in attesa di intervento."}
          {!modelError && modelReady && repairing && `Riparazione in corso… ${progress}%`}
          {!modelError && modelReady && repaired && !engineOn && "Riparazione completata. Pronta all'accensione."}
          {!modelError && modelReady && repaired && engineOn && "Motore acceso: il messaggio esce dalla marmitta."}
        </p>
        <div className="workshop-scene__actions">
          <button
            type="button"
            className={`ignition-control ignition-control--service ${repaired ? "is-ready" : ""}`}
            onClick={onRepair}
            disabled={!modelReady || !!modelError || repairing || repaired}
            aria-label={repaired ? "Auto riparata" : repairing ? "Riparazione in corso" : "Ripara l’auto"}
          >
            <span className="ignition-control__ring">
              <span className="ignition-control__core" />
            </span>
            <span className="ignition-control__label">
              {repaired ? "Riparata" : repairing ? "Riparazione…" : "Ripara"}
            </span>
          </button>

          <button
            type="button"
            className={`ignition-control ignition-control--start ${engineOn ? "is-on" : ""}`}
            onClick={onToggleEngine}
            disabled={!modelReady || !!modelError || !repaired}
            aria-label={engineOn ? "Spegni motore" : "Accendi motore"}
          >
            <span className="ignition-control__ring ignition-key">
              <span className="ignition-key__slot" />
              <span className="ignition-key__tooth" />
            </span>
            <span className="ignition-control__label">
              {engineOn ? "Spegni" : "Avvia"}
            </span>
          </button>
        </div>
        <p className="workshop-scene__note">
          Esperienza 3D interattiva dell’officina: ripara il veicolo e avvia il motore per
          vedere il messaggio allo scarico.
        </p>
      </div>
    </div>
  )
}
