import React from 'react'
import classNames from 'classnames/bind'
import styles from './Box2.module.scss'
const cx = classNames.bind(styles);

interface SegmentType{
    name: string,
    value: number,
}
interface Props{
    titleBox: string;
    arrayData:SegmentType[]
}
export default function Box2({titleBox, arrayData} : Props) {
  return (
    <div className={cx('box-main')}>
        <div className={cx('title')} style={{fontWeight: 550}}>{titleBox}</div>
        <div className={cx('horizontal-line')}></div>
        <div className={cx('details')}>
            {arrayData.map((item, i) => {
                const isShowVerticalLine = i < arrayData.length - 1 ? true : false;
                return(
                    <div key={i} className={cx('segment-data')}>
                        <div>
                            <div style={{fontWeight: 550}}>{item.name}</div>
                            <div>{item.value}</div>
                        </div>
                        {isShowVerticalLine && <div className={cx('vertical-line')}></div>}
                        
                    </div>
                )
            })}

        </div>
      
    </div>
  )
}
