import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('App watchlist', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('adds a country to the watchlist when Watch is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByTestId('watchlist-empty')).toBeInTheDocument()

    const norwayButton = screen.getByRole('button', {
      name: 'Add Norway to watchlist',
    })
    await user.click(norwayButton)

    const list = screen.getByTestId('watchlist-items')
    expect(within(list).getByText('Norway')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Added Norway to your watchlist',
    )
  })
})
