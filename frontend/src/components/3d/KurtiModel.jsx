import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

const KurtiModel = ({ product, ...props }) => {
    const groupRef = useRef();
    const { scene } = useGLTF('/models/indian_woman_in_saree.glb');

    const clonedScene = useMemo(() => {
        const clone = scene.clone();
        const color = product?.color;

        clone.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                const matName = child.material.name.toLowerCase();

                if (color && (matName.includes('fabric') || matName.includes('saree') || matName.includes('dress'))) {
                    child.material.color = new THREE.Color(color);
                }
            }
        });
        return clone;
    }, [scene, product]);

    const scale = product?.name?.toLowerCase().includes('long') ? 2.2 : 2;

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <group ref={groupRef} {...props} dispose={null}>
            <Center top>
                <primitive object={clonedScene} scale={scale} />
            </Center>
        </group>
    );
};

useGLTF.preload('/models/indian_woman_in_saree.glb');

export default KurtiModel;
