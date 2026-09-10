import { render, screen, waitFor } from '@testing-library/react'
import { ViewKpi } from './ViewKpi'
import { AssetDetail } from '../models/assets'
import { fetchMetricData } from '../utils/requests'

jest.mock('../utils/requests', () => ({
  fetchMetricData: jest.fn(),
  getAssetDetails: jest.fn(),
}))

jest.mock('./Modal', () => ({
  Modal: () => <div data-testid="chart-modal">chart modal</div>,
}))

const mockedFetchMetricData = fetchMetricData as jest.MockedFunction<typeof fetchMetricData>

const data: AssetDetail = {
  id: 1,
  name: 'KPI Alpha',
  description_short: 'short',
  description: 'A KPI asset',
  asset_type: 'KPI',
  affiliate: true,
  metrics: [1, 2, 3],
  charts: ['pie', 'bar'],
  questions: [{ title: 'Q1', question: 'How is revenue trending?' }],
}

describe('ViewKpi', () => {
  beforeEach(() => {
    mockedFetchMetricData.mockResolvedValue({
      metricData: { data: [{ id: 11, label: 'Metric 1', name: 'Metric 1', value: 1992 }] },
    } as Awaited<ReturnType<typeof fetchMetricData>>)
  })

  test('renders metric ids, affiliate flag and business questions', async () => {
    render(<ViewKpi data={data} />)

    expect(screen.getByText('Metric IDs:')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('true')).toBeInTheDocument()
    expect(screen.getByText('Q1')).toBeInTheDocument()
    expect(screen.getByText('How is revenue trending?')).toBeInTheDocument()
    expect(await screen.findByText('Visuals available')).toBeInTheDocument()
    await waitFor(() => expect(mockedFetchMetricData).toHaveBeenCalled())
  })
})
