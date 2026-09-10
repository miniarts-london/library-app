import React from 'react'
import { ResponsivePie } from '@nivo/pie'
import { animated } from '@react-spring/web'
import { ChartData } from '../../../models/charts'

export interface PieChartProps {
  data: ChartData[]
  valueFormat: (value: number) => string | number
  props?: any
}

export function PieChart({ data, valueFormat, props }: PieChartProps) {
  return (
    <>
      <ResponsivePie
        {...props}
        data={data}
        margin={{
          top: 40,
          right: 100,
          bottom: 40,
          left: 100,
        }}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 3]],
        }}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={3}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        enableArcLinkLabels={true}
        arcLinkLabel={(datum) => `${datum.label}`}
        arcLinkLabelsSkipAngle={8}
        arcLinkLabelsOffset={0}
        arcLinkLabelsDiagonalLength={6}
        arcLinkLabelsStraightLength={6}
        activeOuterRadiusOffset={9}
        valueFormat={valueFormat}
        animate={true}
        motionConfig="default"
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsComponent={({ label, style }) => {
          if (Number(label) > 2) {
            return (
              <animated.g
                transform={style.transform}
                style={{ pointerEvents: 'none' }}
              >
                <circle fill='#ffffffbf' r={19} />
                <text
                  textAnchor='middle'
                  dominantBaseline='central'
                  fill={style.textColor}
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                >
                  {label} %
                </text>
              </animated.g>
            )
          } else return `<></>`
        }}
      />
    </>
  )
}
