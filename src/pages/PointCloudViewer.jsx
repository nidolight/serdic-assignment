// src/pages/PointCloudViewer.jsx

import React from 'react';

const PointCloudViewer = () => {
  // 나중에 Three.js 캔버스 컴포넌트와 제어 패널 컴포넌트가 이곳에 배치됩니다.

  return (
    <div style={{ padding: '40px' }}>
      <h1>☁️ 포인트 클라우드 뷰어</h1>
      <p style={{ color: 'var(--color-text-p1)' }}>
        이곳은 포인트 클라우드 데이터(.pcd, .ply 등)를 로드하고 3차원 공간에 렌더링하는 핵심 페이지입니다.
      </p>
      
      {/* 3D 뷰어 컴포넌트가 위치할 자리 */}
      <div style={{ 
        width: '100%', 
        height: '60vh', 
        backgroundColor: 'var(--color-bg-6)', 
        marginTop: '30px', 
        border: '1px solid var(--color-bg-3)' 
      }}>
        {/* <PointCloudCanvas /> 컴포넌트 삽입 예정 */}
        <p style={{ padding: '20px', color: 'var(--color-text-p2)' }}>
          [포인트 클라우드 렌더링 영역]
        </p>
      </div>
    </div>
  );
};

export default PointCloudViewer;