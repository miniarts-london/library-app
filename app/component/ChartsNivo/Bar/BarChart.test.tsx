import { BarChart } from './BarChart'
import { render, screen } from '@testing-library/react'

jest.mock('@nivo/bar', () => ({
  ResponsiveBar: (props) => (
    <div data-testid='mock-nivo'>{JSON.stringify(props)}</div>
  ),
}))

describe('BarChart', () => {
  const data = [
    {
      id: 11,
      label: 'Metric 1',
      name: 'Metric 1',
      value: 1992,
    },
    {
      id: 12,
      label: 'Metric 2',
      name: 'Metric 2',
      value: 365,
    },
    {
      id: 13,
      label: 'Metric 3',
      name: 'Metric 3',
      value: 2102,
    },
    {
      id: 14,
      label: 'Metric 4',
      name: 'Metric 4',
      value: 406,
    },
    {
      id: 15,
      label: 'Metric 5',
      name: 'Metric 5',
      value: 1969,
    },
  ]

  test('should render a Bar chart', async () => {
    render(
        <BarChart data={data} props={null} />
    )

    const mockNivo = await screen.findByTestId('mock-nivo')
    expect(mockNivo).toBeInTheDocument()

    expect(await screen.findByText(/Metric 1/i)).toBeInTheDocument()
    expect(await screen.findByText(/1992/i)).toBeInTheDocument()
  })
})
