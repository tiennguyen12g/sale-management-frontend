import React from "react";
import classNames from "classnames/bind";
import styles from "./Arrow2.module.scss";
const cx = classNames.bind(styles);

interface Props {
  arrowAngle: number; // direction left (180deg) or right (0deg default)
  arrowText: string;
  arrowValue: number;
  arrowColor: string;
  direction?: "up" | "down"
}

export default function Arrow2({
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
          x1="0"
          y1="10"
          x2="10"
          y2="10"
          // markerEnd={`url(#${markerId})`}
          transform={`rotate(${arrowAngle}, 75, 30)`}
          stroke={arrowColor}
          strokeWidth={2}
        />

        <line
          x1="10"
          y1="10"
          x2="10"
          y2="70"
          // markerEnd={`url(#${markerId})`}
          transform={`rotate(${arrowAngle}, 75, 30)`}
          stroke={arrowColor}
          strokeWidth={2}
        />
        <line
          x1="10"
          y1="70"
          x2="150"
          y2="70"
          markerEnd={`url(#${markerId})`}
          transform={`rotate(${arrowAngle}, 75, 30)`}
          stroke={arrowColor}
          strokeWidth={2}
        />

        {/* Labels */}
        <text x="20" y="60" style={{ fontSize: 16 }}>
          {arrowText}
        </text>
        <text x="20" y="90" style={{ fontSize: 16 }}>
          {arrowValue.toLocaleString("vi-VN")}₫
        </text>
      </svg>
    </div>
  );
}
