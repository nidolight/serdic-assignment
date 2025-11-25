import React, { useState, useEffect, Suspense, useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
// Three.js 자체 라이브러리의 요소 사용
import * as THREE from 'three';
import styles from './DepthMapViewer.module.css';

// ====================================================================
// ⚠️ 주의: NPZ 파싱 Placeholder ⚠️
// 실제 NPZ 파일은 이 함수를 통해 파싱되고 Float32Array를 반환해야 합니다.
// 현재는 25x25의 가짜 지형 데이터를 생성하여 3D 렌더링 로직을 테스트합니다.
// ====================================================================

const MOCK_SIZE = 256;
const createMockDepthData = () => {
    const values = new Float32Array(MOCK_SIZE * MOCK_SIZE);
    let minVal = Infinity, maxVal = -Infinity;

    for (let i = 0; i < values.length; i++) {
        const x = (i % MOCK_SIZE) / MOCK_SIZE * 2 - 1; // -1 to 1
        const y = Math.floor(i / MOCK_SIZE) / MOCK_SIZE * 2 - 1; // -1 to 1
        
        // 간단한 3D 지형 함수 (Sinusoidal Ripple)
        const val = Math.sin(x * 15) * Math.cos(y * 15) * 0.5 + 1;
        
        values[i] = val;
        if (val < minVal) minVal = val;
        if (val > maxVal) maxVal = val;
    }

    return {
        values: values,
        shape: [MOCK_SIZE, MOCK_SIZE],
        min: minVal,
        max: maxVal
    };
};

// ====================================================================

/**
 * 3D 지형을 렌더링하고 정점 높이를 깊이 데이터로 조작하는 컴포넌트
 */
const DepthSurfaceModel = ({ depthData, depthScale }) => {
    const geometryRef = useRef();
    
    // 데이터가 로드되지 않았거나 Mock 데이터가 없는 경우 렌더링하지 않음
    if (!depthData || !depthData.values.length) return null;

    const width = depthData.shape[0];
    const height = depthData.shape[1];
    
    const widthSegments = width - 1;
    const heightSegments = height - 1;

    // ❗ 핵심: 정점 조작 로직 (깊이 데이터가 변경될 때마다 실행) ❗
    useLayoutEffect(() => {
        if (!geometryRef.current) return;

        const geometry = geometryRef.current;
        const positionAttribute = geometry.attributes.position;
        const depthValues = depthData.values; 
        
        const vertices = positionAttribute.array;
        
        // ❗ 1. Color Attribute를 위한 배열 생성 (정점 수 * 3 채널) ❗
        const colorArray = new Float32Array(depthValues.length * 3); 
        
        const range = depthData.max - depthData.min;
        const scaleFactor = 5.0;
        const color = new THREE.Color();

        for (let i = 0; i < depthValues.length; i++) {
            // 정규화된 깊이 값 (0.0 ~ 1.0)
            const normalizedDepth = (depthValues[i] - depthData.min) / range;
            
            // Z 좌표 업데이트
            vertices[i * 3 + 2] = normalizedDepth * scaleFactor * depthScale; 
            
            // 2. 🎨 색상 계산 (파랑(낮음) -> 빨강(높음) Colormap)
            // Red (r)는 높이에 비례, Blue (b)는 낮음에 비례
            const r = normalizedDepth; 
            const b = 1 - normalizedDepth; 
            color.setRGB(r, 0, b); // G는 0으로 고정
            
            // Color Attribute 배열에 RGB 값 저장
            colorArray[i * 3 + 0] = color.r;
            colorArray[i * 3 + 1] = color.g;
            colorArray[i * 3 + 2] = color.b;
        }
        
        // 3. 지오메트리에 'color' 속성 추가
        geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        // 4. 업데이트 알림 및 재계산
        positionAttribute.needsUpdate = true;
        geometry.computeVertexNormals(); 
        geometry.attributes.normal.needsUpdate = true;
        geometry.center();

    }, [depthData, depthScale]);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}> 
            <planeGeometry 
                ref={geometryRef}
                args={[10, 10, widthSegments, heightSegments]} 
            /> 
            {/* ❗ vertexColors={true} 추가 ❗ */}
            <meshStandardMaterial 
                vertexColors={true} 
                side={THREE.DoubleSide} 
            /> 
        </mesh>
    );
};

// ====================================================================

/**
 * 카메라 정보 업데이트 컴포넌트 (이전 프로젝트와 동일)
 */
const CameraInfoUpdater = ({ setCameraInfo }) => {
    const { camera, controls } = useThree();
    useFrame(() => {
        if (controls) {
            setCameraInfo({
                position: [camera.position.x, camera.position.y, camera.position.z],
                target: [controls.target.x, controls.target.y, controls.target.z],
                pitch: camera.rotation.x * (180 / Math.PI),
                yaw: camera.rotation.y * (180 / Math.PI),
                distance: camera.position.distanceTo(controls.target)
            });
        }
    });
    return null;
};

// ====================================================================

/**
 * 메인 뷰어 컴포넌트
 */
const DepthMapViewer = () => {
    // 1. 상태 정의
    const [file, setFile] = useState(null); 
    const [depthMapData, setDepthMapData] = useState(createMockDepthData()); // Mock 데이터로 초기화
    
    const [depthScale, setDepthScale] = useState(1.0);
    const [showGrid, setShowGrid] = useState(true);
    const [cameraInfo, setCameraInfo] = useState({ position: [0, 0, 15], target: [0, 0, 0], pitch: 0, yaw: 0, distance: 15 }); 
    const controlsRef = useRef(null);

    // 2. NPZ 파일 핸들러 (ArrayBuffer 읽기)
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        
        if (selectedFile && selectedFile.name.endsWith('.npz')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const npzBuffer = e.target.result;
                
                // ⚠️ 여기에서 실제 NPZ 파싱 로직을 호출해야 합니다 ⚠️
                // 현재는 로딩 성공 후 Mock 데이터를 다시 로드하여 렌더링 테스트를 유지합니다.
                setDepthMapData(createMockDepthData()); 
                setFile(selectedFile);
            };

            reader.readAsArrayBuffer(selectedFile);
        } else {
            alert('유효한 .npz 파일을 선택해주세요.');
        }
    };
    
    // 3. 뷰 리셋 핸들러
    const handleResetView = () => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    };

    return (
        <div className={styles.container}>
            <h2>Depth Map Viewer</h2>
            
            <div className={styles.controls}>
                {/* 1. 파일 입력 */}
                <input 
                    type="file" 
                    accept=".npz" 
                    onChange={handleFileChange} 
                />
                <p className={styles.status}>
                    {file ? `✅ 파일 로드 완료: ${file.name}` : '파일을 선택해주세요.'}
                </p>

                {/* 2. 리셋 버튼 */}
                <button onClick={handleResetView} className={styles.resetButton}>
                    🔄 Reset View
                </button>
                
                {/* 3. 뷰어 조정 */}
                <div className={styles.controlsSection}>
                    <h3 className={styles.controlsTitle}>📊 뷰어 조정</h3>
                    <label className={styles.sliderLabel}>
                        Depth Scale: **{depthScale.toFixed(1)}**
                        <input
                            type="range"
                            min="0.1"
                            max="5.0"
                            step="0.1"
                            value={depthScale}
                            onChange={(e) => setDepthScale(parseFloat(e.target.value))}
                            className={styles.sliderInput}
                        />
                    </label>
                </div>
                
                {/* 4. 디스플레이 설정 */}
                <div className={styles.controlsSection}>
                    <h3 className={styles.controlsTitle}>🖼️ 디스플레이 설정</h3>
                    <button 
                        className={showGrid ? styles.toggleActive : styles.toggleInactive}
                        onClick={() => setShowGrid(!showGrid)}
                    >
                        {showGrid ? '✅ Grid 보이기' : '❌ Grid 숨기기'}
                    </button>
                </div>

                {/* 5. 카메라 정보 */}
                <div className={styles.controlsSection}>
                    <h3 className={styles.controlsTitle}>📷 카메라 정보</h3>
                    <ul className={styles.infoList}>
                        <li>**Position:** {cameraInfo.position.map(v => v.toFixed(2)).join(', ')}</li>
                        <li>**Target:** {cameraInfo.target.map(v => v.toFixed(2)).join(', ')}</li>
                        <li>**Pitch / Yaw:** {cameraInfo.pitch.toFixed(1)}° / {cameraInfo.yaw.toFixed(1)}°</li>
                        <li>**Distance:** {cameraInfo.distance.toFixed(2)}</li>
                    </ul>
                </div>
            </div>

            <div className={styles.viewerArea}>
                <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 5]} intensity={1} />

                    <Grid 
                        renderOrder={-1} 
                        cellSize={1} 
                        sectionSize={5} 
                        visible={showGrid}
                        position={[0, 0.001, 0]} 
                        fadeDistance={50}
                        infiniteGrid
                    />

                    <Suspense fallback={null}>
                        <DepthSurfaceModel 
                            depthData={depthMapData} 
                            depthScale={depthScale} 
                        />
                    </Suspense>
                    
                    <CameraInfoUpdater setCameraInfo={setCameraInfo} /> 

                    {/* <OrbitControls ref={controlsRef} makeDefault /> */}
                </Canvas>
            </div>
        </div>
    );
};

export default DepthMapViewer;