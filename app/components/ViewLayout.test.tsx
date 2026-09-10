import { render, screen } from '@testing-library/react'
import { ViewLayout } from './ViewLayout'
import { AssetDetail } from '../models/assets'

const data: AssetDetail = {
  id: 2,
  name: 'Layout Beta',
  description_short: 'short',
  description: 'A layout asset',
  asset_type: 'Layouts',
  used: 33,
  type: 'pie',
  pageNum: 4,
  date: '01/01/2004',
  kpi: ['Revenue', 'Retention'],
}

describe('ViewLayout', () => {
  test('renders layout stats, KPIs and preview', () => {
    render(<ViewLayout data={data} />)

    expect(screen.getByText('33')).toBeInTheDocument()
    expect(screen.getByText('Used')).toBeInTheDocument()
    expect(screen.getByText('pie')).toBeInTheDocument()
    expect(screen.getByText('Pages No.')).toBeInTheDocument()
    expect(screen.getByText('01/01/2004')).toBeInTheDocument()
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('Retention')).toBeInTheDocument()
    expect(screen.getByText('LAYOUT')).toBeInTheDocument()
  })
})
