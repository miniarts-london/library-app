import { render, screen } from '@testing-library/react'
import { ViewChart } from './ViewChart'
import { AssetDetail } from '../models/assets'
import { ChartData } from '../models/charts'

jest.mock('./ChartsNivo/Pie/PieChart', () => ({
  PieChart: () => <div data-testid="pie-chart">pie chart</div>,
}))

jest.mock('./ChartsNivo/Bar/BarChart', () => ({
  BarChart: () => <div data-testid="bar-chart">bar chart</div>,
}))

const data: AssetDetail = {
  id: 9,
  name: 'Chart asset',
  description_short: 'short',
  description: 'A chart',
  asset_type: 'Chart-pie',
  used: 7,
  type: 'pie',
  date: '01/01/2004',
  kpi: ['Conversion'],
}

const metrics: ChartData[] = [
  { id: 11, label: 'Metric 1', name: 'Metric 1', value: 1992 },
  { id: 12, label: 'Metric 2', name: 'Metric 2', value: 365 },
]

describe('ViewChart', () => {
  test('shows loading when metrics are empty', () => {
    render(<ViewChart data={data} metrics={[]} />)

    expect(screen.getByText('Loading ...')).toBeInTheDocument()
    expect(screen.getByText('Conversion')).toBeInTheDocument()
  })

  test('renders a pie chart and metric table', () => {
    render(<ViewChart data={data} metrics={metrics} />)

    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    expect(screen.getByText('Metric 1')).toBeInTheDocument()
    expect(screen.getByText('1992')).toBeInTheDocument()
  })

  test('renders a bar chart when type is not pie', () => {
    render(<ViewChart data={{ ...data, type: 'bar' }} metrics={metrics} />)

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })
})
