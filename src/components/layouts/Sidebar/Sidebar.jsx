import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

import HomeIcon from '@/assets/icons/hamburger.png';
import PointCloudIcon from '@/assets/icons/point-cloud.png';
import DepthMapIcon from '@/assets/icons/depth-map.png';

const navItems = [
  { path: '/', icon: HomeIcon, label: 'Home' },
  { path: '/point-cloud-viewer', icon: PointCloudIcon, label: 'Point Cloud Viewer' },
  { path: '/depth-map-viewer', icon: DepthMapIcon, label: 'Depth Map Viewer' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.path} className={styles.navItem}>
            <Link 
              to={item.path} 
              className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
              title={item.label}
            >
              <div className={styles.icon}>
                <img src={item.icon} alt={item.label} className={styles.iconImage} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;