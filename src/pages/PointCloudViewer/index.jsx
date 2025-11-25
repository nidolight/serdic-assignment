// src/pages/PointCloudViewer/index.jsx

import React, { useState, useEffect, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber'; // 1. R3F 핵심 모듈
import { OrbitControls, Center } from '@react-three/drei'; // 2. 유용한 헬퍼들 (카메라 컨트롤, 중앙 정렬)
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'; // 3. PLY 파일 로더
import styles from './PointCloudViewer.module.css';

// 📦 3D 모델 컴포넌트
// 데이터를 로드하고 화면에 점(Points) 형태로 표시합니다.
const PointCloudModel = ({ url, pointSize, depthScale }) => {
  // useLoader는 데이터를 불러올 때까지 컴포넌트 렌더링을 잠시 중단(Suspend)합니다.
  const geometry = useLoader(PLYLoader, url);
  
  // 불러온 데이터의 중심을 자동으로 맞추기 위해 geometry.center()를 호출할 수도 있지만,
  // 여기서는 <Center> 컴포넌트를 사용하여 더 쉽게 처리합니다.

  return (
      // Depth Scale 적용: <points>를 <group>으로 감싸 Z축 스케일을 조절합니다.
      <group scale={[1, 1, depthScale]}> 
        <points>
          <primitive object={geometry} attach="geometry" />
          {/* ❗ Point Size 적용: pointsMaterial의 size prop으로 사용 ❗ */}
          <pointsMaterial 
            size={pointSize} 
            vertexColors={true} 
            sizeAttenuation={true} 
          />
        </points>
      </group>
    );
};

const PointCloudViewer = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null); // 4. 로더에 전달할 URL 상태


  const [pointSize, setPointSize] = useState(0.05); // 초기 점 크기: 0.05
  const [depthScale, setDepthScale] = useState(1.0);  // 초기 깊이 스케일: 1.0
  // 카메라 초기 정보 (위치, 타겟)
  const [cameraInfo, setCameraInfo] = useState({ position: [0, 0, 5], target: [0, 0, 0] });

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.ply')) {
      setFile(selectedFile);
      
      // 기존 URL이 있다면 메모리 해제
      if (fileUrl) URL.revokeObjectURL(fileUrl);
      
      // 파일 객체를 브라우저 내에서 접근 가능한 URL로 변환
      const objectUrl = URL.createObjectURL(selectedFile);
      setFileUrl(objectUrl);
      
      console.log('File selected:', selectedFile.name);
    } else {
      alert('유효한 .ply 파일을 선택해주세요.');
    }
  };

  // 컴포넌트 언마운트 시 메모리 누수 방지
  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  return (
    <div className={styles.container}>
      <h2>Point Cloud Viewer</h2>
      
      <div className={styles.controls}>
        <input
          type="file"
          id="plyFileInput"
          accept=".ply"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button 
          onClick={() => document.getElementById('plyFileInput').click()}
          className={styles.uploadButton}
        >
          {file ? `파일 변경: ${file.name}` : 'PLY 파일 첨부'}
        </button>
        <div className={styles.controlsSection}>
          <h3 className={styles.controlsTitle}>📊 뷰어 조정</h3>

          {/* 1. Point Size 슬라이더 */}
          <label className={styles.sliderLabel}>
            Point Size: **{pointSize.toFixed(3)}**
            <input
              type="range"
              min="0.001"
              max="0.2"
              step="0.001"
              value={pointSize}
              onChange={(e) => setPointSize(parseFloat(e.target.value))}
              className={styles.sliderInput}
            />
          </label>

          {/* 2. Depth Scale 슬라이더 */}
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
      </div>

      <div className={styles.viewerArea}>
        {fileUrl ? (
          // 5. R3F Canvas 영역
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            {/* 배경색 설정 (css 변수 대신 직접 색상 지정 가능) */}
            <color attach="background" args={['#111']} /> 
            
            <ambientLight intensity={0.5} />
            
            {/* Suspense: 데이터 로딩 중일 때 보여줄 UI 처리 (여기선 null) */}
            <Suspense fallback={null}>
              <Center> {/* 모델을 자동으로 화면 중앙에 배치 */}
                <PointCloudModel 
                  url={fileUrl} 
                  pointSize={pointSize} // Point Size 상태 전달
                  depthScale={depthScale} // Depth Scale 상태 전달
                />
              </Center>
            </Suspense>
            
            {/* 마우스로 화면을 돌려볼 수 있게 해주는 컨트롤 */}
            <OrbitControls makeDefault />
          </Canvas>
        ) : (
          <div style={{ color: '#888' }}>포인트 클라우드 파일을 첨부해주세요.</div>
        )}
      </div>
      <div className={styles.controlsSection}>
          <h3 className={styles.controlsTitle}>조작 방법 (OrbitControls)</h3>
          <ul className={styles.controlList}>
            <li>🖱️ **회전 (Rotate):** 마우스 좌클릭 + 드래그</li>
            <li>🖐️ **이동 (Pan):** 마우스 우클릭 + 드래그 또는 Ctrl/Cmd + 좌클릭 + 드래그</li>
            <li>🔍 **확대/축소 (Zoom):** 마우스 휠 스크롤</li>
          </ul>
        </div>
    </div>
  );
};

export default PointCloudViewer;