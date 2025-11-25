// src/components/layouts/Header/Header.jsx

import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';
import Button from '@/components/common/Button/Button'; 

import LogoImage from '@/assets/logo/white.png';
import BellIcon from '@/assets/icons/header/bell.png';
import QuestionIcon from '@/assets/icons/header/help.png';
import SettingsIcon from '@/assets/icons/header/settings.png';
import LanguageIcon from '@/assets/icons/header/language.png';
import ProfilePlaceholder from '@/assets/icons/header/profile.png'; 

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // 1초마다 시간을 업데이트하는 타이머 설정
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timer);
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  const formatTimeParts = (date) => {
    const fullTimeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
    const parts = fullTimeStr.replace(/:/g, ' ').split(' '); 
    const mainTime = `${parts[0]} ${parts[1]}`;
    const meridian = parts[2]; // "AM" 또는 "PM"
    
    return { mainTime, meridian };
  };

  const timeParts = formatTimeParts(currentTime); // 렌더링 시점에 시간 분리

  return (
    <header className={styles.header}>
      {/* 좌측 섹션: 로고 및 텍스트 */}
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <img src={LogoImage} alt="프로젝트 로고" className={styles.logoImage} />
        </div>
        <span className={styles.title}>Web-based 3D viewer prototype</span>
      </div>

      {/* 우측 섹션: 버튼들, 언어, 프로필, 시간 */}
      <div className={styles.rightSection}>
        {/* 알림 버튼 */}
        <Button variant="tertiary" size="small" onClick={() => console.log('Notification clicked')}>
          <img src={BellIcon} alt="알림" className={styles.iconImage} />
        </Button>
        {/* 도움말 버튼 */}
        <Button variant="tertiary" size="small" onClick={() => console.log('Help clicked')}>
          <img src={QuestionIcon} alt="도움말" className={styles.iconImage} />
        </Button>
        {/* 설정 버튼 */}
        <Button variant="tertiary" size="small" onClick={() => console.log('Settings clicked')}>
          <img src={SettingsIcon} alt="설정" className={styles.iconImage} />
        </Button>
        {/* 언어 설정 버튼 */}
        <Button variant="tertiary" size="small" onClick={() => console.log('Language settings clicked')}>
          <img src={LanguageIcon} alt="언어 설정" className={styles.iconImage} />
        </Button>
        {/* 선택된 언어 */}
        <span className={styles.language}>KR</span>
        {/* 프로필 사진 */}
        <Button 
          variant="tertiary" 
          size="small" 
          onClick={() => console.log('Profile clicked')}
        >
          <img src={ProfilePlaceholder} alt="프로필" className={styles.profileImage} />
        </Button>
        <span className={styles.profile}>ADMIN</span>

        <span className={styles.timeContainer}>
          <span className={styles.mainTime}>{timeParts.mainTime}</span>
          <span className={styles.meridian}>{timeParts.meridian}</span>
        </span>
      </div>
    </header>
  );
};

export default Header;