import React from 'react';
import Button from '@/components/common/Button/Button';

const HomePage = () => {
  return (
    <div style={{ padding: '40px' }}>
      <h1>웹 기반 3D 뷰어 프로토타입</h1>
      <p style={{ fontSize: 'var(--p1-size)', color: 'var(--color-text-p1)' }}>
        환영합니다! 좌측 네비게이션 바를 통해 각 뷰어 페이지로 이동하여 기능을 확인해 보세요.
      </p>
      <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
        <Button variant="primary" size="large">
          시작하기
        </Button>
        <Button variant="secondary" size="large">
          문서 보기
        </Button>
      </div>
      
      <h3 style={{ marginTop: '50px', color: 'var(--color-text-p2)' }}>
        현재 버전: v0.1.0
      </h3>
    </div>
  );
};

export default HomePage;