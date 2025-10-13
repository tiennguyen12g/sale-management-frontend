import React from "react";
import classNames from "classnames/bind";
import styles from "./ArrowUp.module.scss";
const cx = classNames.bind(styles);

interface Props {
  arrowAngle: number; // direction left (180deg) or right (0deg default)
  arrowText: string;
  arrowValue: number;
  arrowColor: string;
}

export default function ArrowUp({
  arrowAngle = 0,
  arrowText = "",
  arrowValue = 0,
  arrowColor,
}: Props) {
  // Generate unique marker id per arrow
  const markerId = `arrowhead-${arrowText.replace(/\s+/g, "-")}-${arrowColor}`;

  return (
    <div className={cx("wrapper")}>
      <svg className={cx("arrows")}>
        <defs>
          <marker
            id={markerId}
            markerWidth="6"
            markerHeight="5"
            refX="6"
            refY="2.5"
            orient="auto"
          >
            <polygon points="0 0, 6 2.5, 0 5" fill={arrowColor} />
          </marker>
        </defs>

        {/* Arrow line */}
        <line
          x1="20"
          y1="0"
          x2="20"
          y2="80"
          markerEnd={`url(#${markerId})`}
          transform={`rotate(${arrowAngle}, 20, 40)`}
          stroke={arrowColor}
          strokeWidth={2}
        />

        {/* Labels */}
        <text x="30" y="40" style={{ fontSize: 16 }}>
          {arrowText}
        </text>
        <text x="30" y="65" style={{ fontSize: 15 }}>
          {arrowValue.toLocaleString("vi-VN")}₫
        </text>
      </svg>
    </div>
  );
}
