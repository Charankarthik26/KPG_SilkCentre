import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const DressModel = ({ ...props }) => {
    const meshRef = useRef();

    // Rotating the model slowly to show detail
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <group {...props} dispose={null}>
            {/* Fallback mock shape since we don't have real 3D assets yet */}
            <mesh ref={meshRef} position={[0, 0, 0]}>
                <cylinderGeometry args={[0.4, 0.6, 1.8, 32]} />
                <meshStandardMaterial
                    color="#D4AF37"
                    metalness={0.6}
                    roughness={0.4}
                    envMapIntensity={2}
                />
            </mesh>

            {/* Decorative ribbons to make the placeholder look dress-like */}
            <mesh position={[0, -0.9, 0]}>
                <cylinderGeometry args={[0.6, 0.9, 0.5, 32]} />
                <meshStandardMaterial color="#8B0045" roughness={0.7} />
            </mesh>
        </group>
    );
};

export default DressModel;
