import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./FastAnswer.module.scss";
const cx = classNames.bind(styles);

interface FastAnswerProps {
  inputValue: string;
  onSelect: (value: string) => void;
}

const quickReplies = [
  { key: "hi", text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?" },
  { key: "ship", text: "Phí ship sẽ được tính tùy theo khu vực của bạn nhé." },
  { key: "thanks", text: "Cảm ơn bạn đã liên hệ với shop!" },
  { key: "time", text: "Thời gian giao hàng dự kiến là 3-5 ngày làm việc." },
  { key: "promo", text: "Hiện tại shop đang có chương trình khuyến mãi, bạn muốn biết thêm không?" },
];

export default function FastAnswer({ inputValue, onSelect }: FastAnswerProps) {
  const [filtered, setFiltered] = useState<typeof quickReplies>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const match = inputValue.match(/\/(\w*)$/);
    if (match) {
      const keyword = match[1].toLowerCase();
      const result = quickReplies.filter((r) => r.key.startsWith(keyword));
      setFiltered(result);
      setActiveIndex(0);
    } else {
      setFiltered([]);
    }
  }, [inputValue]);

  const handleSelect = (text: string) => {
    onSelect(text);
    setFiltered([]);
  };

  /** 👉 Call this from textarea onKeyDown */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!filtered.length) return false;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filtered.length);
      return true;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      return true;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const chosen = filtered[activeIndex];
      if (chosen) handleSelect(chosen.text);
      return true;
    }
    return false;
  };

  if (!filtered.length) return null;

  return (
    <div className={cx("dropdown")}>
      {filtered.map((item, i) => (
        <div
          key={item.key}
          className={cx("item", { active: i === activeIndex })}
          onClick={() => handleSelect(item.text)}
        >
          <span className={cx("shortcut")}>/{item.key}</span>
          <span className={cx("text")}>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

/** Export hook-like helper so parent can intercept keys */
FastAnswer.useKeyHandler = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  inputValue: string,
  onSelect: (v: string) => void,
  stateRef: React.MutableRefObject<any>
): boolean => {
  const match = inputValue.match(/\/(\w*)$/);
  if (!match) return false;

  const keyword = match[1].toLowerCase();
  const quickReplies = [
    { key: "hi", text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?" },
    { key: "ship", text: "Phí ship sẽ được tính tùy theo khu vực của bạn nhé." },
    { key: "thanks", text: "Cảm ơn bạn đã liên hệ với shop!" },
    { key: "time", text: "Thời gian giao hàng dự kiến là 3-5 ngày làm việc." },
    { key: "promo", text: "Hiện tại shop đang có chương trình khuyến mãi, bạn muốn biết thêm không?" },
  ];
  const result = quickReplies.filter((r) => r.key.startsWith(keyword));
  if (!result.length) return false;

  if (!stateRef.current) stateRef.current = { active: 0, list: result };

  if (e.key === "ArrowDown") {
    e.preventDefault();
    stateRef.current.active = (stateRef.current.active + 1) % result.length;
    return true;
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    stateRef.current.active = (stateRef.current.active - 1 + result.length) % result.length;
    return true;
  }
  if (e.key === "Enter") {
    e.preventDefault();
    onSelect(result[stateRef.current.active].text);
    return true;
  }
  return false;
};
