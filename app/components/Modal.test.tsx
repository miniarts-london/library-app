import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'
import { getAssetDetails } from '../utils/requests'
import { renderWithStore } from '../store/test-utils'

jest.mock('../utils/requests', () => ({
  getAssetDetails: jest.fn(),
  fetchMetricData: jest.fn().mockResolvedValue({ metricData: { data: [] } }),
}))

jest.mock('./ViewChart', () => ({
  ViewChart: () => <div data-testid="view-chart" />,
}))

const mockedGetAssetDetails = getAssetDetails as jest.MockedFunction<typeof getAssetDetails>
const writeText = jest.fn().mockResolvedValue(undefined)

const details = {
  id: 1,
  name: 'KPI Alpha',
  description_short: 'Short KPI copy',
  description: 'Longer KPI description',
  asset_type: 'KPI',
  tags: ['trend', 'line'],
  metrics: [1],
  charts: [],
  questions: [],
}

describe('Modal', () => {
  beforeEach(() => {
    mockedGetAssetDetails.mockResolvedValue(details as Awaited<ReturnType<typeof getAssetDetails>>)
    writeText.mockClear()
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
  })

  test('shows loading then the fetched asset details', async () => {
    renderWithStore(
      <Modal
        open
        data={{ id: 1, asset_type: 'KPI' }}
        assetType="KPI"
        setModalOpen={jest.fn()}
      />,
    )

    expect(screen.getByText('Loading ...')).toBeInTheDocument()
    expect(await screen.findByText('KPI Alpha')).toBeInTheDocument()
    expect(screen.getByText('Short KPI copy')).toBeInTheDocument()
    expect(screen.getByText('#trend')).toBeInTheDocument()
  })

  test('closes when the close button is clicked', async () => {
    const user = userEvent.setup()
    const setModalOpen = jest.fn()

    renderWithStore(
      <Modal
        open
        data={{ id: 1, asset_type: 'KPI' }}
        assetType="KPI"
        setModalOpen={setModalOpen}
      />,
    )

    await screen.findByText('KPI Alpha')
    await user.click(screen.getByText('Close modal').closest('button') as HTMLButtonElement)

    expect(setModalOpen).toHaveBeenCalledWith(false)
  })

  test('toggles favourite from the modal', async () => {
    const user = userEvent.setup()

    renderWithStore(
      <Modal
        open
        data={{ id: 1, asset_type: 'KPI' }}
        assetType="KPI"
        setModalOpen={jest.fn()}
      />,
    )

    await screen.findByText('KPI Alpha')
    await user.click(screen.getByText('Favourite item'))
    expect(screen.getByText('Remove favourite')).toBeInTheDocument()
  })

  test('copies a share link', async () => {
    renderWithStore(
      <Modal
        open
        data={{ id: 1, asset_type: 'KPI' }}
        assetType="KPI"
        setModalOpen={jest.fn()}
      />,
    )

    await screen.findByText('KPI Alpha')
    fireEvent.click(document.getElementById('copy-link') as HTMLButtonElement)

    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('/AssetView?id=1&assetType=KPI'),
    )
  })
})
