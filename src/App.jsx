import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './index.css'; // ❗❗ 1. CSS 모듈 Import ❗❗

import Sidebar from './components/layouts/Sidebar/Sidebar'; 
import Header from './components/layouts/Header/Header';

import HomePage from './pages/HomePage';
import PointCloudViewer from './pages/PointCloudViewer';
import DepthMapViewer from './pages/DepthMapViewer';

function App() {
  return (
    <Router>
      <Sidebar />
      <Header />
      
      <main className={styles.mainContent}>
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