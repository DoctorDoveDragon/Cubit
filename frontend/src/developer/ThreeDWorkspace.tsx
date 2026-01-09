/**
 * 3D Workspace Component
 * Advanced 3D programming environment with Three.js
 */

'use client'

import React, { useState, Suspense } from 'react'
import { FiPlay, FiRotateCw } from 'react-icons/fi'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Box, Sphere, Cone } from '@react-three/drei'
import * as THREE from 'three'

interface Shape3D {
  type: 'cube' | 'sphere' | 'cone'
  position: [number, number, number]
  color: string
  size: number
}

const SAMPLE_CODE = `# 3D Scene Example
# Create a simple 3D scene with shapes

# Draw a cube at origin
cube(0, 0, 0, 1, "blue")

# Draw a sphere above
sphere(0, 2, 0, 0.8, "red")

# Draw a cone to the side
cone(2, 0, 0, 1, "green")`

function Scene3D({ shapes }: { shapes: Shape3D[] }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      {/* Grid */}
      <Grid args={[10, 10]} />

      {/* Shapes */}
      {shapes.map((shape, idx) => {
        const pos = new THREE.Vector3(...shape.position)
        const material = <meshStandardMaterial color={shape.color} />
        
        switch (shape.type) {
          case 'cube':
            return (
              <Box key={idx} position={pos} args={[shape.size, shape.size, shape.size]}>
                {material}
              </Box>
            )
          case 'sphere':
            return (
              <Sphere key={idx} position={pos} args={[shape.size, 32, 32]}>
                {material}
              </Sphere>
            )
          case 'cone':
            return (
              <Cone key={idx} position={pos} args={[shape.size, shape.size * 2, 32]}>
                {material}
              </Cone>
            )
          default:
            return null
        }
      })}

      {/* Camera Controls */}
      <OrbitControls enableDamping dampingFactor={0.05} />
    </>
  )
}

export default function ThreeDWorkspace() {
  const [code, setCode] = useState(SAMPLE_CODE)
  const [shapes] = useState<Shape3D[]>([
    { type: 'cube', position: [0, 0, 0], color: '#3b82f6', size: 1 },
    { type: 'sphere', position: [0, 2, 0], color: '#ef4444', size: 0.8 },
    { type: 'cone', position: [2, 0, 0], color: '#10b981', size: 1 },
  ])
  const [cameraReset, setCameraReset] = useState(0)

  const handleRun = () => {
    // TODO: Implement 3D code parsing
    // In a real implementation, this would parse the code and extract shapes
    // For now, this is a placeholder for demonstration
    console.log('Running 3D code:', code)
    alert('3D code parsing not yet implemented. This is a demo workspace.')
  }

  const handleResetCamera = () => {
    setCameraReset(prev => prev + 1)
  }

  return (
    <div className="space-y-4">
      {/* Code Editor */}
      <div>
        <label className="block text-sm font-bold text-gray-400 mb-2">
          3D Scene Code
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-48 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 font-mono text-sm focus:outline-none focus:border-green-400"
          placeholder="Enter 3D code..."
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleRun}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <FiPlay />
          Run Scene
        </button>
        <button
          onClick={handleResetCamera}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <FiRotateCw />
          Reset Camera
        </button>
      </div>

      {/* 3D Viewport */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-400">3D Viewport</span>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Shapes: {shapes.length}</span>
            <span>|</span>
            <span>Left-click: Rotate • Right-click: Pan • Scroll: Zoom</span>
          </div>
        </div>
        <div className="h-[500px] bg-black">
          <Canvas
            key={cameraReset}
            camera={{ position: [5, 5, 5], fov: 50 }}
            style={{ background: '#000' }}
          >
            <Suspense fallback={null}>
              <Scene3D shapes={shapes} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* Shape Properties */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <h4 className="text-sm font-bold text-gray-400 mb-2">Scene Info</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Shapes:</span>
              <span className="text-gray-200">{shapes.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cubes:</span>
              <span className="text-blue-400">{shapes.filter(s => s.type === 'cube').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Spheres:</span>
              <span className="text-red-400">{shapes.filter(s => s.type === 'sphere').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cones:</span>
              <span className="text-green-400">{shapes.filter(s => s.type === 'cone').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <h4 className="text-sm font-bold text-gray-400 mb-2">Lighting</h4>
          <div className="space-y-1 text-sm text-gray-300">
            <div>• Ambient: 50%</div>
            <div>• Directional: (10, 10, 5)</div>
            <div>• Point: (-10, -10, -5)</div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <h4 className="text-sm font-bold text-gray-400 mb-2">Camera</h4>
          <div className="space-y-1 text-sm text-gray-300">
            <div>• Position: (5, 5, 5)</div>
            <div>• FOV: 50°</div>
            <div>• Controls: Orbit</div>
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <h4 className="text-sm font-bold text-blue-400 mb-2">3D Functions Reference</h4>
        <div className="space-y-2 text-sm text-blue-300">
          <div><code className="bg-gray-900 px-2 py-1 rounded">cube(x, y, z, size, color)</code> - Draw a cube</div>
          <div><code className="bg-gray-900 px-2 py-1 rounded">sphere(x, y, z, radius, color)</code> - Draw a sphere</div>
          <div><code className="bg-gray-900 px-2 py-1 rounded">cone(x, y, z, size, color)</code> - Draw a cone</div>
        </div>
      </div>
    </div>
  )
}
