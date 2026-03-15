import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

const SareeModel = ({ product, ...props }) => {
    const groupRef = useRef();

    // Mapping logic: Check if the product has a specific model assigned in the DB
    // Or fallback to the high-quality draped base.
    const modelPath = useMemo(() => {
        // PRIORITY 1: Use the specific model path from the database if provided
        if (product?.model_path || product?.modelPath) {
            return product.model_path || product.modelPath;
        }

        const name = (product?.name || '').toLowerCase();

        // PRIORITY 2: Distinct Models for specific saree types to avoid repetition
        if (name.includes('kanchipuram') || name.includes('silk')) {
            return '/models/traditional_saree.glb';
        }

        // PRIORITY 3: High-detail scanned model
        return '/models/silk_saree_3d_scan.glb';
    }, [product]);

    const { scene } = useGLTF(modelPath);

    const clonedScene = useMemo(() => {
        const clone = scene.clone();
        const color = product?.color;

        // Only apply "Similiar color" tint if the scan itself isn't a pre-textured photo-real scan
        // Professional scans (like the 3D scan) usually have textures that shouldn't be overridden.
        // But for the 'traditional_saree' base, we tint to match the product.
        if (modelPath.includes('traditional_saree')) {
            clone.traverse((child) => {
                if (child.isMesh) {
                    child.material = child.material.clone();
                    const matName = child.material.name.toLowerCase();

                    if (color && (matName.includes('saree') || matName.includes('fabric') || matName.includes('body'))) {
                        child.material.color = new THREE.Color(color);
                    }
                }
            });
        }
        return clone;
    }, [scene, product, modelPath]);

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
                    scale={modelPath.includes('scan') ? 1.8 : 2.5}
                />
            </Center>
        </group>
    );
};

useGLTF.preload('/models/traditional_saree.glb');
useGLTF.preload('/models/silk_saree_3d_scan.glb');

export default SareeModel;
