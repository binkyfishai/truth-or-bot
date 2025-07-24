import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Mesh } from 'three'

const SpinningIcosahedron = () => {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <mesh ref={meshRef} scale={2}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial wireframe color="#1DA1F2" />
    </mesh>
  )
}

interface ThreeBackgroundProps {
  className?: string
}

const ThreeBackground = ({ className }: ThreeBackgroundProps) => {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 5] }} className="w-full h-full">
        <ambientLight intensity={0.5} />
        <SpinningIcosahedron />
      </Canvas>
    </div>
  )
}

export default ThreeBackground
