import React, { Suspense, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useProgress, Html } from '@react-three/drei';
import { XR, createXRStore } from '@react-three/xr';
import { ArrowLeft, Smartphone, ExternalLink, Move3d } from 'lucide-react';
import DressModel from '../components/3d/DressModel';
import SareeModel from '../components/3d/SareeModel';
import ShirtModel from '../components/3d/ShirtModel';
import KurtiModel from '../components/3d/KurtiModel';
import { API_BASE_URL } from '../config';
import './XRViewer.css';

const store = createXRStore({
    offerSession: false
});

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="loader-text">{progress.toFixed(2)}% loaded</div>
        </Html>
    );
}

const XRViewer = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        // Fetch product to determine category and color
        fetch(`${API_BASE_URL}/products`)
            .then(res => res.json())
            .then(data => {
                const item = data.find(p => p.id === parseInt(id));
                setProduct(item);
            })
            .catch(err => console.error('Error fetching product for AR:', err));
    }, [id]);

    const renderModel = () => {
        if (!product) return <DressModel position={[0, -1, 0]} />;

        const cat = (product.category || '').toLowerCase();
        const subCat = (product.sub_category || product.subCategory || '').toLowerCase();

        // Convert CSS color name mapped nicely, or fallback
        const modelColor = product.color || undefined;

        if (cat === 'mens' || subCat.includes('shirt')) {
            return <ShirtModel position={[0, -0.5, 0]} product={product} />;
        } else if (subCat.includes('saree')) {
            return <SareeModel position={[0, -0.5, 0]} product={product} />;
        } else if (subCat.includes('kurti')) {
            return <KurtiModel position={[0, -0.5, 0]} product={product} />;
        }

        // Default to Saree for Womens if subcategory isn't recognized
        if (cat === 'womens') {
            return <SareeModel position={[0, -0.5, 0]} product={product} />;
        }

        return <DressModel position={[0, -0.5, 0]} product={product} />;
    };

    return (
        <div className="xr-container">
            <div className="xr-header glass-panel">
                <Link to={`/product/${id}`} className="back-link-xr">
                    <ArrowLeft size={20} /> Back to Product
                </Link>
                <button
                    className="btn btn-primary"
                    onClick={() => store.enterAR()}
                >
                    <Smartphone size={18} /> Enter AR Mode
                </button>
            </div>

            <div className="canvas-wrapper">
                <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
                    <XR store={store}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                        <Suspense fallback={<Loader />}>
                            {renderModel()}
                            <Environment preset="city" />
                            <ContactShadows position={[0, -1.05, 0]} opacity={0.5} scale={5} blur={2} far={2} />
                        </Suspense>
                        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
                    </XR>
                </Canvas>
            </div>

            <div className="xr-help-badge glass-panel">
                <Move3d size={16} className="text-primary" />
                <span>Interact to rotate & zoom</span>
            </div>
        </div>
    );
};

export default XRViewer;

