/**
 * Global type declarations for React Three Fiber
 */

import { Object3DNode, MaterialNode } from '@react-three/fiber'
import { Mesh, Material, Light } from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: Object3DNode<Light, typeof Light>
      directionalLight: Object3DNode<Light, typeof Light>
      pointLight: Object3DNode<Light, typeof Light>
      meshStandardMaterial: MaterialNode<Material, typeof Material>
    }
  }
}

export {}
