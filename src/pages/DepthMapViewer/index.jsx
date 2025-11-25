import React from 'react';

const DepthMapViewer = () => {
  // 나중에 뎁스 맵 이미지를 표시하고 색상화하는 로직이 들어갑니다.

  return (
    <div style={{ padding: '40px' }}>
      <h1>🗺️ 뎁스 맵 뷰어</h1>
      <p style={{ color: 'var(--color-text-p1)' }}>
        이곳은 2D 뎁스 맵 이미지 데이터를 시각화하고 색상 맵핑을 통해 깊이 정보를 분석하는 페이지입니다.
      </p>

       {/* 뎁스 맵 캔버스 또는 이미지 영역 */}
      <div style={{ 
        width: '100%', 
        height: '60vh', 
        backgroundColor: 'var(--color-bg-6)', 
        marginTop: '30px', 
        border: '1px solid var(--color-bg-3)' 
      }}>
        {/* <DepthMapCanvas /> 컴포넌트 삽입 예정 */}
        <p style={{ padding: '20px', color: 'var(--color-text-p2)' }}>
          [뎁스 맵 시각화 영역]
        </p>
      </div>
    </div>
  );
};

export default DepthMapViewer;