import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind'
import styles from './CustomSelectGlobal.module.scss'
const cx = classNames.bind(styles)

interface CustomSelectProps {
  options: {name: string, key: string}[];
  onChange: (value: string) => void;
  placeholder?: string;
  dropdownPosition?: 'top' | 'bottom'; // New prop
}

const CustomSelectGlobal: React.FC<CustomSelectProps> = ({ 
  options, 
  onChange, 
  placeholder = "-- Chọn thẻ --",
  dropdownPosition = 'bottom' // Default to bottom
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionKey: string, name: string) => {
    setSelected(name);
    setIsOpen(false);
    onChange(optionKey);
  };

  return (
    <div className={cx('customSelect')} ref={dropdownRef}>
      <div 
        className={cx('selectTrigger')}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected || placeholder}
        <span className={cx('arrow')}>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className={cx('optionsList', dropdownPosition === 'top' ? 'optionsListTop' : 'optionsListBottom')}>
          {options.map((option, i) => (
            <div
              key={i}
              className={cx('option')}
              onClick={() => handleSelect(option.key, option.name)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelectGlobal;