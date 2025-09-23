'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Camera as CameraIcon, X, Download, Box, Move3d, RotateCcw, Camera, Info } from 'lucide-react'
import * as THREE from 'three'

interface ARViewButtonProps {
  placeName: string
  placeImage: string
  coordinates: [number, number]
}

export default function ARViewButton({ placeName, placeImage, coordinates }: ARViewButtonProps) {
  console.log('🔍 ARViewButton rendering for:', placeName)
  const [isARActive, setIsARActive] = useState(false)
  const [isSupported, setIsSupported] = useState(true) // Always show button, handle errors on click
  const [error, setError] = useState<string | null>(null)
  const [is3DMode, setIs3DMode] = useState(false)
  const [viewMode, setViewMode] = useState<'perspective' | 'top' | 'side'>('perspective')
  const [extensionDetected, setExtensionDetected] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const threeCanvasRef = useRef<HTMLCanvasElement>(null)
  const captureCanvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const deviceOrientationRef = useRef({ alpha: 0, beta: 0, gamma: 0 })
  const initialOrientationRef = useRef({ alpha: 0, beta: 0, gamma: 0 })
  const modelsGroupRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    const checkARSupport = async () => {
      try {
        console.log('Checking AR support...')
        
        // Skip extension detection to avoid false warnings
        setExtensionDetected(false)
        
        // Check AR support with isolation
        if (typeof window !== 'undefined' && window.navigator) {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log('AR supported')
            setError(null) // Clear any previous errors
          } else {
            console.log('Camera not supported')
            // Don't set isSupported to false, just note the error for later
          }
        }
      } catch (err) {
        console.error('Support check error:', err)
        setError('Failed to check camera support')
        setExtensionDetected(false)
      }
    }

    // Add device orientation listener
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      deviceOrientationRef.current = {
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('deviceorientation', handleDeviceOrientation)
    }
    
    // Delay to avoid extension conflicts
    const timer = setTimeout(checkARSupport, 1000)
    
    return () => {
      clearTimeout(timer)
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleDeviceOrientation)
      }
    }
  }, [])

  // Handle view mode changes
  useEffect(() => {
    if (cameraRef.current && is3DMode) {
      console.log('View mode changed to:', viewMode)
      // Force camera update when view mode changes
      updateCameraView(0, 0, 0)
    }
  }, [viewMode, is3DMode])

  const startARView = async () => {
    try {
      console.log('=== AR VIEW START ===')
      console.log('Place:', placeName)
      console.log('Video ref current:', !!videoRef.current)
      
      setError(null)
      setIsLoading(true)
      
      // Check if getUserMedia is available before activating AR
      if (!navigator?.mediaDevices?.getUserMedia) {
        setError('Camera API not available in this browser')
        setIsLoading(false)
        return
      }
      
      console.log('Requesting camera permissions...')
      
      // Try to get camera stream first, before activating AR UI
      let stream: MediaStream
      try {
        // Try environment camera first (back camera on mobile)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })
        console.log('✅ Environment camera obtained')
      } catch (envError) {
        console.log('Environment camera failed, trying user camera...')
        try {
          // Try user camera (front camera)
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }
          })
          console.log('✅ User camera obtained')
        } catch (userError) {
          console.log('User camera failed, trying basic video...')
          try {
            // Try basic video without constraints
            stream = await navigator.mediaDevices.getUserMedia({
              video: true
            })
            console.log('✅ Basic camera obtained')
          } catch (basicError) {
            throw basicError // Re-throw the final error
          }
        }
      }
      
      console.log('✅ Camera stream obtained:', stream)
      console.log('Video tracks:', stream.getVideoTracks().length)
      
      // Only activate AR UI after successfully getting camera stream
      setIsARActive(true)
      
      // Wait for video element to be available
      await new Promise(resolve => setTimeout(resolve, 150))
      
      console.log('Video ref after activation:', !!videoRef.current)
      
      if (!videoRef.current) {
        console.error('❌ Video ref still null after activation')
        // Clean up stream before erroring
        stream.getTracks().forEach(track => track.stop())
        setError('Video element failed to initialize')
        setIsARActive(false)
        return
      }
      
      console.log('Setting video source...')
      videoRef.current.srcObject = stream
      streamRef.current = stream
      
      // Set up video loading events with better error handling
      videoRef.current.onloadedmetadata = () => {
        console.log('✅ Video metadata loaded')
        // Ensure video plays
        videoRef.current?.play().catch(playError => {
          console.error('Video play error:', playError)
        })
      }
      
      videoRef.current.onerror = (e) => {
        console.error('❌ Video playback error:', e)
        setError('Video playback failed')
        stopARView() // Clean up on video error
      }
      
      // Try to play the video
      try {
        await videoRef.current.play()
        console.log('✅ Video playing successfully')
      } catch (playError) {
        console.log('Video autoplay blocked, user interaction required')
      }
      
      console.log('✅ AR view fully activated')
      setIsLoading(false)
      
    } catch (err: any) {
      console.error('❌ AR Error Details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      })
      
      // Don't set AR active to false if it was never set to true
      if (isARActive) {
        setIsARActive(false)
      }
      
      let errorMessage = 'Unknown error occurred'
      
      switch (err.name) {
        case 'NotAllowedError':
          errorMessage = '🚫 Camera permission denied. Please allow camera access and try again.'
          break
        case 'NotFoundError':
          errorMessage = '📷 No camera found. Please connect a camera or try a different device.'
          break
        case 'NotReadableError':
          errorMessage = '🔒 Camera is being used by another application. Close other camera apps and try again.'
          break
        case 'OverconstrainedError':
          errorMessage = '⚙️ Camera constraints not supported. Please try a different device.'
          break
        case 'SecurityError':
          errorMessage = '🔐 Camera access blocked by security settings. Try using HTTPS or localhost.'
          break
        case 'AbortError':
          errorMessage = '⏹️ Camera access was interrupted. Please try again.'
          break
        default:
          errorMessage = `❌ Camera error: ${err.message || err.name || 'Unknown issue'}`
      }
      
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const stopARView = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    if (rendererRef.current) {
      rendererRef.current.dispose()
      rendererRef.current = null
    }
    
    setIsARActive(false)
    setIs3DMode(false)
    setIsLoading(false)
  }

  const init3DScene = () => {
    try {
      if (!threeCanvasRef.current) {
        console.error('Canvas ref not available for 3D scene')
        return
      }

      // Clean up existing scene first
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current = null
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ 
        canvas: threeCanvasRef.current, 
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true
      })
      
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.setClearColor(0x000000, 0) // Transparent background

      setupLighting(scene)
      
      const models = create3DModels(placeName)
      
      const modelsGroup = new THREE.Group()
      models.forEach(model => modelsGroup.add(model))
      scene.add(modelsGroup)
      
      modelsGroupRef.current = modelsGroup
      
      // Set initial camera position
      camera.position.set(0, 10, 18)
      camera.lookAt(0, 4, 0)
      
      sceneRef.current = scene
      rendererRef.current = renderer
      cameraRef.current = camera
      
      console.log('3D Scene initialized successfully for:', placeName)
      animate()
    } catch (error) {
      console.error('3D Scene initialization error:', error)
      setError('3D rendering failed. Please try refreshing the page.')
    }
  }

  const create3DModels = (placeName: string) => {
    const models: THREE.Object3D[] = []
    const name = placeName.toLowerCase()
    
    // Enhanced ground plane
    const groundGeometry = new THREE.PlaneGeometry(40, 40, 32, 32)
    const vertices = groundGeometry.attributes.position.array as Float32Array
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i + 2] = Math.sin(vertices[i] * 0.1) * Math.cos(vertices[i + 1] * 0.1) * 0.5
    }
    groundGeometry.attributes.position.needsUpdate = true
    groundGeometry.computeVertexNormals()
    
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x4A5D23, 
      transparent: true, 
      opacity: 0.6
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    models.push(ground)

    if (name.includes('jagannath') || name.includes('temple')) {
      const templeGroup = new THREE.Group()
      
      // Main temple structure - larger and more prominent
      const sanctumGeometry = new THREE.BoxGeometry(8, 8, 8)
      const sanctumMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xD2691E, 
        shininess: 40,
        specular: 0x444444
      })
      const sanctum = new THREE.Mesh(sanctumGeometry, sanctumMaterial)
      sanctum.position.set(0, 4, 0)
      sanctum.castShadow = true
      sanctum.receiveShadow = true
      templeGroup.add(sanctum)
      
      // Enhanced multi-tiered shikhara
      for (let tier = 0; tier < 5; tier++) {
        const radius = 4 - tier * 0.5
        const height = 2.5 - tier * 0.3
        const shikharaGeometry = new THREE.ConeGeometry(radius, height, 16)
        const shikharaMaterial = new THREE.MeshPhongMaterial({ 
          color: tier % 2 === 0 ? 0xFFD700 : 0xFFA500, 
          shininess: 80
        })
        const shikhara = new THREE.Mesh(shikharaGeometry, shikharaMaterial)
        shikhara.position.set(0, 8.5 + tier * 2, 0)
        shikhara.castShadow = true
        templeGroup.add(shikhara)
      }
      
      // Temple pillars
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.4, 6, 8)
        const pillarMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 })
        const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
        pillar.position.set(Math.cos(angle) * 6, 3, Math.sin(angle) * 6)
        pillar.castShadow = true
        templeGroup.add(pillar)
      }
      
      // Temple base platform
      const baseGeometry = new THREE.CylinderGeometry(10, 12, 1, 16)
      const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 })
      const base = new THREE.Mesh(baseGeometry, baseMaterial)
      base.position.set(0, 0.5, 0)
      base.receiveShadow = true
      templeGroup.add(base)
      
      models.push(templeGroup)
    } else if (name.includes('hundru') || name.includes('falls') || name.includes('dassam') || name.includes('jonha')) {
      const waterfallGroup = new THREE.Group()
      
      // Create a more realistic waterfall structure
      // Main cliff face
      const cliffGeometry = new THREE.BoxGeometry(16, 20, 4)
      const cliffMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 })
      const cliff = new THREE.Mesh(cliffGeometry, cliffMaterial)
      cliff.position.set(0, 10, -2)
      cliff.castShadow = true
      cliff.receiveShadow = true
      waterfallGroup.add(cliff)
      
      // Waterfall stream (vertical plane)
      const streamGeometry = new THREE.PlaneGeometry(2, 18)
      const streamMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x87CEEB, 
        transparent: true, 
        opacity: 0.7 
      })
      const stream = new THREE.Mesh(streamGeometry, streamMaterial)
      stream.position.set(0, 9, 0)
      waterfallGroup.add(stream)
      
      // Water pool at bottom
      const poolGeometry = new THREE.CylinderGeometry(6, 6, 0.5, 16)
      const poolMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4169E1, 
        transparent: true, 
        opacity: 0.8 
      })
      const pool = new THREE.Mesh(poolGeometry, poolMaterial)
      pool.position.set(0, 0.25, 2)
      waterfallGroup.add(pool)
      
      // Surrounding rocks
      for (let i = 0; i < 8; i++) {
        const rockGeometry = new THREE.SphereGeometry(1 + Math.random() * 2, 8, 6)
        const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 })
        const rock = new THREE.Mesh(rockGeometry, rockMaterial)
        const angle = (i / 8) * Math.PI * 2
        rock.position.set(
          Math.cos(angle) * (8 + Math.random() * 4),
          Math.random() * 2,
          Math.sin(angle) * (8 + Math.random() * 4)
        )
        rock.castShadow = true
        waterfallGroup.add(rock)
      }
      
      // Trees around the waterfall
      for (let i = 0; i < 12; i++) {
        const treeGeometry = new THREE.ConeGeometry(1.5, 8, 8)
        const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 })
        const tree = new THREE.Mesh(treeGeometry, treeMaterial)
        const angle = Math.random() * Math.PI * 2
        const distance = 12 + Math.random() * 8
        tree.position.set(
          Math.cos(angle) * distance,
          4,
          Math.sin(angle) * distance
        )
        tree.castShadow = true
        waterfallGroup.add(tree)
      }
      
      models.push(waterfallGroup)
    } else if (name.includes('netarhat') || name.includes('hill') || name.includes('parasnath')) {
      const hillGroup = new THREE.Group()
      
      // Create layered hills for depth
      for (let layer = 0; layer < 4; layer++) {
        for (let i = 0; i < 6; i++) {
          const hillGeometry = new THREE.SphereGeometry(3 + Math.random() * 4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2)
          const hillMaterial = new THREE.MeshLambertMaterial({ 
            color: layer === 0 ? 0x228B22 : layer === 1 ? 0x32CD32 : layer === 2 ? 0x90EE90 : 0xADFF2F
          })
          const hill = new THREE.Mesh(hillGeometry, hillMaterial)
          const angle = (i / 6) * Math.PI * 2
          const distance = 8 + layer * 6
          hill.position.set(
            Math.cos(angle) * distance,
            -1 + Math.random() * 3,
            Math.sin(angle) * distance
          )
          hill.castShadow = true
          hill.receiveShadow = true
          hillGroup.add(hill)
        }
      }
      
      // Viewpoint platform
      const platformGeometry = new THREE.CylinderGeometry(4, 4, 0.5, 16)
      const platformMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 })
      const platform = new THREE.Mesh(platformGeometry, platformMaterial)
      platform.position.set(0, 0.25, 0)
      platform.receiveShadow = true
      hillGroup.add(platform)
      
      // Sunrise point marker
      const markerGeometry = new THREE.ConeGeometry(0.5, 3, 8)
      const markerMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 })
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.set(0, 2, 0)
      marker.castShadow = true
      hillGroup.add(marker)
      
      // Pine trees scattered around
      for (let i = 0; i < 15; i++) {
        const treeGeometry = new THREE.ConeGeometry(0.8, 6, 8)
        const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x006400 })
        const tree = new THREE.Mesh(treeGeometry, treeMaterial)
        const angle = Math.random() * Math.PI * 2
        const distance = 6 + Math.random() * 12
        tree.position.set(
          Math.cos(angle) * distance,
          3,
          Math.sin(angle) * distance
        )
        tree.castShadow = true
        hillGroup.add(tree)
      }
      
      models.push(hillGroup)
    } else if (name.includes('betla') || name.includes('national park') || name.includes('palamau') || name.includes('tiger reserve')) {
      const parkGroup = new THREE.Group()
      
      // Create a forest clearing with wildlife elements
      // Dense forest background
      for (let i = 0; i < 25; i++) {
        const treeGeometry = new THREE.ConeGeometry(1.2 + Math.random() * 0.8, 6 + Math.random() * 4, 8)
        const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 })
        const tree = new THREE.Mesh(treeGeometry, treeMaterial)
        const angle = Math.random() * Math.PI * 2
        const distance = 15 + Math.random() * 10
        tree.position.set(
          Math.cos(angle) * distance,
          3 + Math.random() * 2,
          Math.sin(angle) * distance
        )
        tree.castShadow = true
        parkGroup.add(tree)
      }
      
      // Wildlife viewing platform
      const platformGeometry = new THREE.BoxGeometry(6, 0.5, 6)
      const platformMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 })
      const platform = new THREE.Mesh(platformGeometry, platformMaterial)
      platform.position.set(0, 0.25, 0)
      platform.receiveShadow = true
      parkGroup.add(platform)
      
      // Watchtower
      const towerGeometry = new THREE.CylinderGeometry(1, 1.2, 8, 8)
      const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 })
      const tower = new THREE.Mesh(towerGeometry, towerMaterial)
      tower.position.set(4, 4, 4)
      tower.castShadow = true
      parkGroup.add(tower)
      
      // Safari jeep model
      const jeepBody = new THREE.BoxGeometry(4, 1.5, 2)
      const jeepMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 })
      const jeep = new THREE.Mesh(jeepBody, jeepMaterial)
      jeep.position.set(-6, 1, 2)
      jeep.castShadow = true
      parkGroup.add(jeep)
      
      // Jeep wheels
      for (let i = 0; i < 4; i++) {
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 8)
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 })
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
        wheel.rotation.z = Math.PI / 2
        wheel.position.set(
          -6 + (i % 2) * 3,
          0.5,
          2 + (i < 2 ? -0.8 : 0.8)
        )
        parkGroup.add(wheel)
      }
      
      // Wildlife silhouettes (deer)
      for (let i = 0; i < 3; i++) {
        const deerBody = new THREE.SphereGeometry(0.8, 8, 6)
        const deerMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 })
        const deer = new THREE.Mesh(deerBody, deerMaterial)
        const angle = (i / 3) * Math.PI * 2
        deer.position.set(
          Math.cos(angle) * 8,
          1,
          Math.sin(angle) * 8
        )
        deer.castShadow = true
        parkGroup.add(deer)
      }
      
      models.push(parkGroup)
    } else {
      // Default building for other places
      const buildingGeometry = new THREE.BoxGeometry(4, 6, 4)
      const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 })
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial)
      building.position.y = 3
      building.castShadow = true
      building.receiveShadow = true
      models.push(building)
    }

    return models
  }

  const setupLighting = (scene: THREE.Scene) => {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 50
    scene.add(directionalLight)
    
    const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.3)
    fillLight.position.set(-5, 8, -5)
    scene.add(fillLight)
    
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.2)
    rimLight.position.set(0, 5, -10)
    scene.add(rimLight)
  }

  const updateCameraView = (alpha: number, beta: number, gamma: number) => {
    if (!cameraRef.current) return

    switch (viewMode) {
      case 'perspective':
        // Gentle orbital movement around the scene
        const time = Date.now() * 0.0003
        const radius = 18
        const height = 10
        cameraRef.current.position.set(
          Math.sin(time) * radius,
          height + Math.sin(time * 0.5) * 2,
          Math.cos(time) * radius
        )
        cameraRef.current.lookAt(0, 4, 0)
        break
      case 'top':
        // Stable top-down view - completely static for clear view
        cameraRef.current.position.set(0, 35, 0)
        cameraRef.current.lookAt(0, 0, 0)
        // Ensure camera up vector is correct for top view
        cameraRef.current.up.set(0, 0, -1)
        break
      case 'side':
        // Side view - static position for clear profile view
        cameraRef.current.position.set(30, 15, 0)
        cameraRef.current.lookAt(0, 8, 0)
        // Reset camera up vector for side view
        cameraRef.current.up.set(0, 1, 0)
        break
    }
  }

  const animate = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return
    
    // Only update camera view for perspective mode (which has animation)
    // Static views (top/side) are set once and don't need continuous updates
    if (viewMode === 'perspective') {
      updateCameraView(0, 0, 0)
    }
    
    // Animate models with more natural movements
    if (modelsGroupRef.current) {
      const time = Date.now() * 0.0008 // Slower animation speed
      modelsGroupRef.current.children.forEach((child, index) => {
        if (child.type === 'Group') {
          // Gentle rotation
          child.rotation.y = Math.sin(time + index * 0.5) * 0.15
          // Subtle floating motion
          child.position.y = Math.sin(time * 0.8 + index) * 0.3
          // Slight scale breathing effect
          const scale = 1 + Math.sin(time * 0.6 + index) * 0.05
          child.scale.set(scale, scale, scale)
        }
      })
    }
    
    rendererRef.current.render(sceneRef.current, cameraRef.current)
    animationFrameRef.current = requestAnimationFrame(animate)
  }

  const switchViewMode = () => {
    const nextView = viewMode === 'perspective' ? 'top' : viewMode === 'top' ? 'side' : 'perspective'
    console.log('Switching view from', viewMode, 'to', nextView)
    setViewMode(nextView)
    
    // Force immediate camera update for the new view
    if (cameraRef.current) {
      setTimeout(() => {
        updateCameraView(0, 0, 0)
      }, 50)
    }
  }

  const toggle3DMode = () => {
    console.log('Toggling 3D mode, current:', is3DMode)
    const newMode = !is3DMode
    setIs3DMode(newMode)
    if (newMode) {
      setTimeout(() => {
        console.log('Initializing 3D scene...')
        init3DScene()
      }, 100)
    } else {
      // Clean up 3D scene when disabled
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current = null
      }
    }
  }

  // Always show the AR button - handle errors when clicked instead of hiding the button

  console.log('🎯 ARViewButton return - isARActive:', isARActive, 'placeName:', placeName)
  
  return (
    <div className="relative">
      {extensionDetected && (
        <div className="mb-2 p-2 bg-orange-100 border border-orange-300 rounded-lg text-sm text-orange-700">
          ⚠️ Extension detected - AR may not work properly
        </div>
      )}
      {!isARActive ? (
        <div className="space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm font-medium mb-2">AR Error</p>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-red-600 text-xs underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('🎯 AR button clicked - starting AR view')
              setError(null) // Clear any previous errors
              startARView()
            }}
            className={`px-6 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 w-full ${
              isLoading 
                ? 'bg-blue-500 text-white cursor-wait' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Starting Camera...</span>
              </>
            ) : (
              <>
                <CameraIcon size={20} />
                <span>Try AR View</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="fixed inset-0 z-[10000] bg-black">
          {/* Video Stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            className="absolute inset-0"
            onError={(e) => {
              console.error('Video element error:', e)
              setError('Video element failed to load')
            }}
            onLoadStart={() => {
              console.log('Video load started')
            }}
          />
          
          {/* 3D Canvas Overlay */}
          {is3DMode && (
            <canvas
              ref={threeCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ 
                background: 'transparent',
                mixBlendMode: 'normal',
                opacity: 0.9
              }}
            />
          )}

          {/* AR Controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-50">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                stopARView()
              }}
              className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors touch-manipulation"
              style={{ minWidth: '48px', minHeight: '48px' }}
            >
              <X size={24} />
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggle3DMode()
                }}
                className={`p-3 rounded-full shadow-lg transition-colors touch-manipulation ${
                  is3DMode ? 'bg-green-500 text-white' : 'bg-white text-gray-800'
                }`}
                style={{ minWidth: '48px', minHeight: '48px' }}
              >
                {is3DMode ? <Move3d size={24} /> : <Box size={24} />}
              </button>
              
              {is3DMode && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      switchViewMode()
                    }}
                    className={`p-3 rounded-full shadow-lg transition-colors touch-manipulation ${
                      viewMode === 'perspective' ? 'bg-blue-500 text-white' : 
                      viewMode === 'top' ? 'bg-purple-500 text-white' : 
                      'bg-orange-500 text-white'
                    } hover:opacity-80`}
                    title={`Current: ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View - Click to switch`}
                    style={{ minWidth: '48px', minHeight: '48px' }}
                  >
                    <Camera size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      deviceOrientationRef.current = { alpha: 0, beta: 0, gamma: 0 }
                      initialOrientationRef.current = { alpha: 0, beta: 0, gamma: 0 }
                    }}
                    className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors touch-manipulation"
                    title="Reset Orientation"
                    style={{ minWidth: '48px', minHeight: '48px' }}
                  >
                    <RotateCcw size={24} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* AR Overlay Information */}
          <div className="absolute bottom-4 left-4 right-4 z-50">
            <div className="bg-black/70 backdrop-blur-md rounded-2xl p-4 text-white">
              <div className="flex items-center gap-4">
                <Image
                  src={placeName.toLowerCase().includes('betla national park') 
                    ? 'https://media.assettype.com/outlooktraveller%2F2025-08-25%2Fs6bgbbsn%2Fsnapins-ai3641832999873957478.jpg?w=480&auto=format%2Ccompress&fit=max'
                    : placeImage}
                  alt={placeName}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                  onError={(e) => {
                    console.error('AR overlay image failed to load:', placeImage);
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{placeName}</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    {is3DMode ? '3D AR Experience Active' : 'Camera View'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                    <span className="px-2 py-1 bg-blue-500/30 rounded-full whitespace-nowrap">
                      {viewMode === 'perspective' ? 'Perspective' : viewMode === 'top' ? 'Top View' : 'Side View'}
                    </span>
                    {is3DMode && (
                      <span className="px-2 py-1 bg-green-500/30 rounded-full whitespace-nowrap">3D Active</span>
                    )}
                    <span className="px-2 py-1 bg-gray-500/30 rounded-full whitespace-nowrap">
                      Tap buttons to control
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden canvases for capture */}
          <canvas ref={canvasRef} className="hidden" />
          <canvas ref={captureCanvasRef} className="hidden" />
        </div>
      )}
    </div>
  )
}   