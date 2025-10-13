import React from 'react';
import classNames from 'classnames/bind'
import styles from './MainPage.module.scss'
const cx = classNames.bind(styles)
import { Outlet } from "react-router-dom";
// Menu
import MainMenu from './MenuComponent/MainMenu';
import MainMenu_v2 from './MenuComponent/MainMenu_v2';
//Body
import BodyMain from './BodyComponent/BodyMain';
import BodyRoutes from './BodyComponent/BodyRoute';
export default function MainPage() {
  return (
    <div className={cx('main-page')}>
        <MainMenu_v2 />
        <BodyMain />
        {/* <BodyRoutes /> */}
    </div>
  )
}
