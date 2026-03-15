import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

const ShirtModel = ({ product, ...props }) => {
    const groupRef = useRef();

    // Switch between specific high-quality scans based on product type
    const modelPath = useMemo(() => {
        const name = (product?.name || '').toLowerCase();

        // If it's a formal set, use the full outfit scan
        if (name.includes('formal') || name.includes('set') || name.includes('pant')) {
            return '/models/male_formal_outfit.glb';
        }

        // Default to the high-quality solo shirt scan
        return '/models/shirt.glb';
    }, [product]);

    const { scene } = useGLTF(modelPath);

    const clonedScene = useMemo(() => {
        const clone = scene.clone();
        const color = product?.color;

        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                const matName = child.material.name.toLowerCase();

                // Only tint if it's not a pre-textured professional scan or if color is specific
                if (color && (matName.includes('shirt') || matName.includes('top') || matName.includes('fabric'))) {
                    child.material.color = new THREE.Color(color);
                }
            }
        });
        return clone;
    }, [scene, product]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <group ref={groupRef} {...props} dispose={null}>
            <Center top>
                <primitive
                    object={clonedScene}
                    scale={modelPath.includes('outfit') ? 2 : 2.5}
                />
            </Center>
        </group>
    );
};

useGLTF.preload('/models/male_formal_outfit.glb');
useGLTF.preload('/models/shirt.glb');

export default ShirtModel;
