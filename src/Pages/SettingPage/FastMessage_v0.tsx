// FastMessage.jsx
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { X, Plus, MapPin, Image, Paperclip, Video, Shirt, Code } from 'lucide-react';
import styles from './FastMessage.module.scss';

const cx = classNames.bind(styles);

export default function FastMessage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, keyword: 'gia', content: 'gia san pham nay la' },
    { id: 2, keyword: 'anh', content: 'hinh anh san pham' },
    { id: 3, keyword: 'testanh', content: '🎭 haha' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [contentBlocks, setContentBlocks] = useState([
    { id: 1, content: '' },
    { id: 2, content: '' }
  ]);

  const handleAddMessage = () => {
    if (newKeyword.trim() && contentBlocks.some(block => block.content.trim())) {
      const combinedContent = contentBlocks
        .filter(block => block.content.trim())
        .map(block => block.content)
        .join(' ');
      
      setMessages([...messages, {
        id: messages.length + 1,
        keyword: newKeyword,
        content: combinedContent
      }]);
      
      setNewKeyword('');
      setContentBlocks([{ id: 1, content: '' }, { id: 2, content: '' }]);
      setIsModalOpen(false);
    }
  };

  const handleAddContentBlock = () => {
    setContentBlocks([...contentBlocks, { id: contentBlocks.length + 1, content: '' }]);
  };

  const handleContentChange = (id: any, value: any) => {
    setContentBlocks(contentBlocks.map(block => 
      block.id === id ? { ...block, content: value } : block
    ));
  };

  const filteredMessages = messages.filter(msg => 
    msg.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cx('main')}>
      <h2 className={cx('title')}>Hỗ trợ trả lời</h2>
      
      <div className={cx('card')}>
        <div className={cx('header')}>
          <h3 className={cx('header-title')}>Trả lời nhanh</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className={cx('btn-primary')}
          >
            Thêm mẫu
          </button>
        </div>

        <div className={cx('table-wrapper')}>
          <table className={cx('table')}>
            <thead>
              <tr className={cx('table-header-row')}>
                <th className={cx('table-header', 'stt')}>STT</th>
                <th className={cx('table-header')}>Ký tự tắt</th>
                <th className={cx('table-header', 'search-header')}>
                  <div className={cx('header-content')}>
                    Tin nhắn
                    <input
                      type="text"
                      placeholder="🔍"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={cx('search-input')}
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg, index) => (
                <tr key={msg.id} className={cx('table-row')}>
                  <td className={cx('table-cell')}>{index + 1}</td>
                  <td className={cx('table-cell')}>{msg.keyword}</td>
                  <td className={cx('table-cell')}>{msg.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className={cx('modal-overlay')}>
          <div className={cx('modal')}>
            <div className={cx('modal-header')}>
              <h3 className={cx('modal-title')}>Thêm câu trả lời nhanh</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className={cx('btn-close')}
              >
                <X size={24} />
              </button>
            </div>

            <div className={cx('modal-body')}>
              <div className={cx('form-group')}>
                <label className={cx('form-label')}>Ký tự tắt</label>
                <div className={cx('input-wrapper')}>
                  <span className={cx('input-prefix')}>/</span>
                  <input
                    type="text"
                    placeholder="Nhập ký tự"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className={cx('input-keyword')}
                  />
                </div>
              </div>

              {contentBlocks.map((block, index) => (
                <div key={block.id} className={cx('content-block')}>
                  <div className={cx('content-block-inner')}>
                    <div className={cx('content-block-header')}>
                      <span className={cx('drag-handle')}>⋮⋮</span>
                      <span className={cx('collapse-icon')}>▼</span>
                      <span className={cx('content-label')}>Nội dung {index + 1}</span>
                    </div>
                    <textarea
                      placeholder="Nhập nội dung"
                      value={block.content}
                      onChange={(e) => handleContentChange(block.id, e.target.value)}
                      className={cx('textarea', {
                        'textarea-focused': index === contentBlocks.length - 1
                      })}
                    />
                    <div className={cx('content-actions')}>
                      <button className={cx('action-btn')}>
                        <Image size={20} />
                      </button>
                      <button className={cx('action-btn')}>
                        <Paperclip size={20} />
                      </button>
                      <button className={cx('action-btn')}>
                        <Video size={20} />
                      </button>
                      <button className={cx('action-btn')}>
                        <Shirt size={20} />
                      </button>
                      <button className={cx('action-btn')}>
                        <Code size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className={cx('add-actions')}>
                <button
                  onClick={handleAddContentBlock}
                  className={cx('btn-text')}
                >
                  <Plus size={20} />
                  Thêm nội dung
                </button>
                <button className={cx('btn-text')}>
                  <MapPin size={20} />
                  Thêm yêu cầu địa chỉ
                </button>
              </div>

              <div className={cx('info-box')}>
                ⓘ Bạn có thể thêm tới đa 10 nội dung và 120 hình ảnh
              </div>

              <div className={cx('modal-footer')}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={cx('btn-secondary')}
                >
                  Đóng
                </button>
                <button
                  onClick={handleAddMessage}
                  className={cx('btn-primary')}
                >
                  Lưu mẫu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}