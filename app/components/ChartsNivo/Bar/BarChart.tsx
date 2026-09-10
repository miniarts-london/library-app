import React from 'react'

import { ResponsiveBar } from '@nivo/bar'
import { barFixedProps } from './fixed-props'

export function BarChart({ data, props }: any) {

  const TotalLabels = ({ bars, yScale }: any) => {
    const labelMargin = -10

    return bars.map(
      ({ data: { indexValue, id, value }, x }: any, i: number) => {
        const valueStr = value.toString()
        const key = `${id}-$${indexValue}-${i}`
        return (
          <g
            transform={`translate(${x}, ${yScale(value) - labelMargin})`}
            key={key}
          >
            <filter x='-0.1' y='-0.1' width='1.2' height='1.2' id='background'>
              <feFlood floodColor='#ffffff96' result='bg' />
              <feMerge>
                <feMergeNode in='bg' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>

            <text
              filter='url(#background)'
              y={labelMargin / 2}
              x='13'
              textAnchor='end'
              alignmentBaseline='central'
              style={{
                fontSize: '0.8em',
                fill: 'rgb(51, 51, 51)',
                transform: 'rotate(-60deg)',
              }}
            >
              {valueStr}
            </text>
          </g>
        )
      },
    )
  }

  return (
    <>
      <ResponsiveBar
        layers={['grid', 'axes', 'bars', TotalLabels, 'markers', 'legends']}
        {...barFixedProps}
        {...props}
        data={data}
      />
    </>
  )
}
