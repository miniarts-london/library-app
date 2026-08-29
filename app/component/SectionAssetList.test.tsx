import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SectionAssetList } from './SectionAssetList'
import { AssetList } from '../models/assets'

const assets: AssetList[] = [
  {
    id: 1,
    name: 'Low likes KPI',
    description: 'Least popular',
    date: '01/01/2004',
    asset_type: 'KPI',
    likes: 1,
    featured: false,
  },
  {
    id: 2,
    name: 'Hot layout',
    description: 'Most popular layout',
    date: '02/01/2004',
    asset_type: 'Layouts',
    likes: 50,
    featured: true,
  },
  {
    id: 3,
    name: 'Mid storyboard',
    description: 'Somewhere in the middle',
    date: '03/01/2004',
    asset_type: 'Storyboards',
    likes: 20,
    featured: true,
  },
]

describe('SectionAssetList', () => {
  test('renders the section title and assets', () => {
    render(
      <SectionAssetList
        title="Featured"
        assets={[...assets]}
        handleOpenModal={jest.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Featured' })).toBeInTheDocument()
    expect(screen.getByText('Curated top picks from this week')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'Low likes KPI' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('heading', { name: 'Hot layout' }).length).toBeGreaterThan(0)
  })

  test('calls handleOpenModal when an asset is clicked', async () => {
    const user = userEvent.setup()
    const handleOpenModal = jest.fn()

    render(
      <SectionAssetList
        title="KPI"
        assets={[...assets]}
        handleOpenModal={handleOpenModal}
      />,
    )

    await user.click(screen.getAllByRole('heading', { name: 'Hot layout' })[0].closest('a') as HTMLElement)

    expect(handleOpenModal).toHaveBeenCalled()
    expect(handleOpenModal.mock.calls[0][1]).toMatchObject({
      id: 2,
      asset_type: 'Layouts',
    })
  })

  test('shows the highest-liked assets in Trending', async () => {
    render(
      <SectionAssetList
        title="KPI"
        assets={[...assets]}
        handleOpenModal={jest.fn()}
      />,
    )

    expect(await screen.findByRole('heading', { name: 'Trending' })).toBeInTheDocument()
    expect(screen.getByText('Most polular by community')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'Hot layout' }).length).toBeGreaterThan(0)
  })
})
