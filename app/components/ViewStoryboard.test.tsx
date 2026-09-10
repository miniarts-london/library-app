import { render, screen } from '@testing-library/react'
import { ViewStoryboard } from './ViewStoryboard'
import { AssetDetail } from '../models/assets'

const data: AssetDetail = {
  id: 3,
  name: 'Storyboard Gamma',
  description_short: 'short',
  description: 'A storyboard asset',
  asset_type: 'Storyboards',
  used: 10,
  type: 'bar',
  pageNum: 8,
  date: '02/02/2004',
  kpi: ['NPS'],
  affiliate_list: ['Brand A', 'Brand B'],
}

describe('ViewStoryboard', () => {
  test('renders storyboard details, affiliates and request access', () => {
    render(<ViewStoryboard data={data} />)

    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('NPS')).toBeInTheDocument()
    expect(screen.getByText('Brand A')).toBeInTheDocument()
    expect(screen.getByText('Brand B')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /request access/i })).toBeInTheDocument()
  })
})
