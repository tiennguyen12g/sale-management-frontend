import React from 'react'
import classNames from 'classnames/bind'
import styles from './AdsAccount.module.scss'

const cx = classNames.bind(styles)

export default function AdsAccountLayout() {
  return (
    <div className={cx('wrapper')}>
      {/* Far Left Icon Bar */}
      <div className={cx('icon-bar')}>
        <div className={cx('icon-item')}>{/* Menu icon */}</div>
        <div className={cx('icon-item')}>{/* Cart icon */}</div>
        <div className={cx('icon-item')}>{/* Doc icon */}</div>
        <div className={cx('icon-spacer')}></div>
        <div className={cx('icon-item')}>{/* Flag icon */}</div>
        <div className={cx('icon-item')}>{/* Github icon */}</div>
        <div className={cx('icon-item')}>{/* Settings icon */}</div>
        <div className={cx('icon-item')}>{/* User icon */}</div>
        <div className={cx('icon-item')}>{/* More icon */}</div>
      </div>

      <div className={cx('main-page')}>
        {/* Left Sidebar */}
        <div className={cx('sidebar')}>
          <div className={cx('sidebar-header')}>
            <div className={cx('logo-section')}>
              {/* Logo and title */}
            </div>
          </div>
          <div className={cx('sidebar-menu')}>
            <div className={cx('menu-item', 'active')}>Ads Check Pro</div>
            <div className={cx('menu-item', 'new-badge')}>Tính quản lý</div>
            <div className={cx('menu-item')}>Extended Payment</div>
            <div className={cx('menu-item')}>Xóa QTV ẩn</div>
            <div className={cx('menu-item')}>Đổi thức TKQC</div>
            <div className={cx('menu-item')}>Share Pixel</div>
            <div className={cx('menu-item', 'coming-soon')}>Super Share</div>
            <div className={cx('menu-item')}>Super Target</div>
            <div className={cx('menu-item')}>Ads Save</div>
            <div className={cx('menu-item')}>Kháng TKQC</div>
          </div>
          <div className={cx('sidebar-footer')}>
            <div className={cx('footer-info')}>
              {/* Footer content */}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={cx('content-wrapper')}>
          {/* Top Header Bar */}
          <div className={cx('header')}>
            <div className={cx('header-left')}>
              <div className={cx('header-tabs')}>
                <div className={cx('tab', 'active')}>TK Cá nhân</div>
                <div className={cx('tab')}>TK BM</div>
                <div className={cx('tab')}>Page</div>
              </div>
            </div>
            <div className={cx('header-right')}>
              <div className={cx('header-actions')}>
                {/* Action buttons */}
              </div>
            </div>
          </div>

          {/* Filter/Action Bar */}
          <div className={cx('action-bar')}>
            <div className={cx('action-left')}>
              <div className={cx('status-tabs')}>
                <div className={cx('status-tab', 'active')}>Hoạt động</div>
                <div className={cx('status-tab')}>Tất cả</div>
              </div>
            </div>
            <div className={cx('action-right')}>
              <div className={cx('action-buttons')}>
                {/* Right side action buttons */}
              </div>
            </div>
          </div>

          {/* Data Table with Border */}
          <div className={cx('table-wrapper')}>
            <div className={cx('table-container')}>
              <div className={cx('table-header')}>
                <div className={cx('table-cell')}>Tài khoản</div>
                <div className={cx('table-cell')}>ID gốc</div>
                <div className={cx('table-cell')}>Số dư</div>
                <div className={cx('table-cell')}>Ngưỡng</div>
                <div className={cx('table-cell')}>Ngưỡng còn lại</div>
                <div className={cx('table-cell')}>Limit</div>
                <div className={cx('table-cell')}>Tổng tiêu</div>
                <div className={cx('table-cell')}>GHI CHÚ</div>
                <div className={cx('table-cell')}>Tiền tệ</div>
                <div className={cx('table-cell')}>Quyền sở hữu</div>
                <div className={cx('table-cell')}>Chiết hạn chi tiêu</div>
              </div>
              <div className={cx('table-body')}>
                <div className={cx('table-row')}>
                  <div className={cx('table-cell')}>
                    {/* Row content */}
                  </div>
                </div>
                <div className={cx('table-row')}>
                  <div className={cx('table-cell')}>
                    {/* Row content */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Summary Bar */}
          <div className={cx('summary-bar')}>
            <div className={cx('summary-content')}>
              {/* Summary content */}
            </div>
          </div>

          {/* Footer */}
          <div className={cx('footer')}>
            <div className={cx('footer-left')}>
              {/* Footer left content */}
            </div>
            <div className={cx('footer-right')}>
              <div className={cx('pagination')}>1 / 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}