import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. 레이아웃 컴포넌트 Import
import Sidebar from './components/layouts/Sidebar/Sidebar'; 

// 2. 페이지 컴포넌트 Import
import HomePage from './pages/HomePage';
import PointCloudViewer from './pages/PointCloudViewer';
import DepthMapViewer from './pages/DepthMapViewer';

function App() {
  return (
    <Router>
      <Sidebar />
            <main style={{ marginLeft: '82px', minHeight: '100vh' }}>
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