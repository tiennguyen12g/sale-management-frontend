import React, {useState} from 'react'
import classNames from 'classnames/bind'
import styles from './NewLayout.module.scss';
const cx = classNames.bind(styles);
import { useMainMenuStore } from '../zustand/mainMenuCollapsed';
import MainMenu from './MainMenu';
export default function NewLayout({ children }: { children: React.ReactNode }) {
    const { openMenu, activeSubmenu, setOpenMenu, setActiveSubmenu, menuCollapsed, toggleMenuCollapse } = useMainMenuStore();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className={cx('main-new-layout')}>
      <div className={cx('left-menu')} style={{width: menuCollapsed ? 65 : 165}}>
        <MainMenu isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
      </div>
      <div className={cx('main-body')}>
          {children}
      </div>

      {/* This is for Ads Account Management */}
      {/* <div className={cx('main-body')}>
        <div className={cx('body-left')}></div>
        <div className={cx('body-right')}>
            <div className={cx('header')}></div>
            <div className={cx('content')}></div>
            <div className={cx('footer')}></div>
        </div>
      </div> */}
    </div>
  )
}
