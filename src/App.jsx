import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './components/common/Button/Button';

function App() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Button 컴포넌트 테스트</h1>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Button variant="primary" onClick={() => alert('Primary Click!')}>
          3D 모델 로드
        </Button>
        <Button variant="secondary" size="small">
          설정 저장
        </Button>
        <Button variant="tertiary" size="large">
          데이터 다운로드
        </Button>
        <Button variant="primary" disabled>
          데이터 분석 (비활성화)
        </Button>
      </div>
    </div>
  );
}

export default App;
