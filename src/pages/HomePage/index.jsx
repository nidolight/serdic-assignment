import React from 'react';
import Button from '@/components/common/Button/Button';

const HomePage = () => {
  return (
    <div style={{ padding: '40px' }}>
      <p style={{ fontSize: 'var(--p1-size)', color: 'var(--color-text-p1)' }}>
        본 프로젝트는 세르딕 프론트엔드/풀스택 개발자 채용 과제로 제작되었습니다.
      </p>
      <p style={{ fontSize: 'var(--p1-size)', color: 'var(--color-text-p1)' }}>
        화면 좌측의 아이콘을 통해 Point Cloud VIewer와 Depth Map Viewer 이용 가능합니다.
      </p>
    </div>
  );
};

export default HomePage;