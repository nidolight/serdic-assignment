import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/layouts/Sidebar/Sidebar'; 
import Header from './components/layouts/Header/Header'; // ❗ Header 컴포넌트 Import ❗

import HomePage from './pages/HomePage';
import PointCloudViewer from './pages/PointCloudViewer';
import DepthMapViewer from './pages/DepthMapViewer';

function App() {
  return (
    <Router>
      <Sidebar />
      <Header /> {/* ❗ Header 컴포넌트 추가 ❗ */}
      
      {/* 메인 콘텐츠 영역: Sidebar와 Header의 높이를 고려한 마진/패딩 */}
      <main style={{ 
          marginLeft: '102px', /* Sidebar + 좌측 마진 + 간격 */
          marginTop: '82px',   /* Header 높이(60px) + 상단 마진(12px) + 간격(10px) */
          marginRight: '12px', /* 우측 마진 */
          minHeight: 'calc(100vh - 94px)', /* 100vh - 상단 마진(12) - 하단 마진(12) - 헤더 높이(60) - 간격(10) */
          padding: '20px',     /* 콘텐츠 내부 패딩 */
          backgroundColor: 'var(--color-bg-6)', /* 콘텐츠 영역 배경색 */
          borderRadius: '12px' /* 콘텐츠 영역 둥근 모서리 */
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/point-cloud-viewer" element={<PointCloudViewer />} />
          <Route path="/depth-map-viewer" element={<DepthMapViewer />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;