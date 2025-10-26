import React, {useState, useEffect} from 'react'
import classNames from 'classnames/bind'
import styles from './SettingPage.module.scss'

const cx = classNames.bind(styles)
import ManageTags from '../BodyComponent/FacebookAPI/ManageTags';
import GeneralSetting from './GeneralSetting';
export default function SettingPage() {
    const [activePage, setAcctivePage] = useState<string>("general-setting")
  return (
    <div className={cx('main-setting')}>
      {/* Left Sidebar Menu */}
      <div className={cx('sidebar')}>
        <h2 className={cx('sidebar-title')}>Cài đặt</h2>
        
        <div className={cx('menu-list')}>
          <div className={cx('menu-item', activePage === "general-setting" ? "active" : "")} onClick={() => setAcctivePage("general-setting")}>
            <span className={cx('icon')}>⚙️</span>
            <span className={cx('text')}>Cài đặt chung</span>
          </div>
          
          <div className={cx('menu-item', activePage === "tag-management" ? "active" : "")} onClick={() => setAcctivePage("tag-management")}>
            <span className={cx('icon')}>🏷️</span>
            <span className={cx('text')}>Thẻ hội thoại</span>
          </div>
          
          <div className={cx('menu-item')}>
            <span className={cx('icon')}>✨</span>
            <span className={cx('text')}>Trợ lý AI</span>
            <span className={cx('badge')}>Beta</span>
          </div>
          
          <div className={cx('menu-item')}>
            <span className={cx('icon')}>💬</span>
            <span className={cx('text')}>Hỗ trợ trả lời</span>
          </div>
          
          <div className={cx('menu-item')}>
            <span className={cx('icon')}>💻</span>
            <span className={cx('text')}>Giao diện</span>
          </div>
          
          <div className={cx('menu-item')}>
            <span className={cx('icon')}>📞</span>
            <span className={cx('text')}>Cuộc gọi</span>
          </div>
          
          <div className={cx('menu-item')}>
            <span className={cx('icon')}>🔄</span>
            <span className={cx('text')}>Chế độ xoay vòng</span>
          </div>
          
          <div className={cx('menu-item')}>
            <span className={cx('icon')}>☁️</span>
            <span className={cx('text')}>Đồng bộ</span>
          </div>
          
          <div className={cx('menu-item')}>
            <span className={cx('icon')}>🔧</span>
            <span className={cx('text')}>Công cụ</span>
          </div>
          
          <div className={cx('menu-item')}>
            <span className={cx('icon')}>👥</span>
            <span className={cx('text')}>Phân quyền</span>
          </div>
          
          <div className={cx('menu-item')}>
            <span className={cx('icon')}>🕐</span>
            <span className={cx('text')}>Lịch sử</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={cx('content')}>
        {activePage === "general-setting" && <GeneralSetting />}
        {activePage === "tag-management" && <ManageTags />}
      </div>
    </div>
  )
}