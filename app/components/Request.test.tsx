import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Request } from './Request'

function RequestHarness({ startOpen = false }: { startOpen?: boolean }) {
  const [requestOpen, setRequestOpen] = useState(startOpen)
  return <Request requestOpen={requestOpen} setRequestOpen={setRequestOpen} />
}

describe('Request', () => {
  test('opens the request form and sends', async () => {
    const user = userEvent.setup()
    render(<RequestHarness />)

    await user.click(screen.getByRole('button', { name: 'Request' }))

    expect(screen.getByRole('heading', { name: 'Request' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(screen.getByRole('button', { name: 'Request' })).toBeVisible()
  })

  test('closes the form from the close button', async () => {
    const user = userEvent.setup()
    render(<RequestHarness startOpen />)

    await user.click(screen.getByRole('button', { name: /close request/i }))

    expect(screen.getByRole('button', { name: 'Request' })).toBeVisible()
  })
})
