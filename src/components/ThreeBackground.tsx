import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Mesh } from 'three'

const SpinningIcosahedron = () => {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002
      meshRef.current.rotation.y += 0.001
      meshRef.current.rotation.z += 0.0005
    }
  })

  return (
    <mesh ref={meshRef} scale={1.5}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial 
        wireframe 
        color="#3B82F6" 
        transparent 
        opacity={0.3}
      />
    </mesh>
  )
}

const FloatingParticles = () => {
  const particlesRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001
      // Create a subtle floating effect
      particlesRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  // Create particle positions
  const particleCount = 50
  const positions = new Float32Array(particleCount * 3)
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#8B5CF6" 
        size={0.02} 
        transparent 
        opacity={0.6}
      />
    </points>
  )
}

const PulsingSphere = () => {
  const sphereRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (sphereRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      sphereRef.current.scale.setScalar(scale)
      sphereRef.current.rotation.x += 0.01
      sphereRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={sphereRef} position={[2, -1, -2]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial 
        color="#10B981" 
        transparent 
        opacity={0.2}
        wireframe
      />
    </mesh>
  )
}

interface ThreeBackgroundProps {
  className?: string
}

const ThreeBackground = ({ className }: ThreeBackgroundProps) => {
  return (
    <div className={className}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 60 }} 
        className="w-full h-full"
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#3B82F6" />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#8B5CF6" />
        
        <SpinningIcosahedron />
        <FloatingParticles />
        <PulsingSphere />
        
        {/* Additional geometric shapes for visual interest */}
        <mesh position={[-3, 2, -1]}>
          <octahedronGeometry args={[0.8]} />
          <meshBasicMaterial 
            color="#EC4899" 
            transparent 
            opacity={0.15}
            wireframe
          />
        </mesh>
        
        <mesh position={[3, -2, -3]}>
          <tetrahedronGeometry args={[0.6]} />
          <meshBasicMaterial 
            color="#06B6D4" 
            transparent 
            opacity={0.2}
            wireframe
          />
        </mesh>
      </Canvas>
    </div>
  )
}

export default ThreeBackground
