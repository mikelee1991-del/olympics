import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { PLANNER_STORAGE_KEY } from './data/planner'

describe('App watchlist', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('adds a country to the watchlist from the medal demo tab', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Medal demo' }))
    expect(screen.getByTestId('watchlist-empty')).toBeInTheDocument()

    const usaButton = screen.getByRole('button', {
      name: 'Add United States to watchlist',
    })
    await user.click(usaButton)

    expect(screen.getByTestId('watchlist-items')).toHaveTextContent(
      'United States',
    )
  })
})

describe('Planner', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('loads seeded sessions and toggles ticket status', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByTestId('planner')).toBeInTheDocument()
    expect(screen.getByTestId('count-want')).toBeInTheDocument()
    expect(screen.getByTestId('venue-map')).toBeInTheDocument()

    const haveButtons = screen.getAllByRole('button', {
      name: /Mark .+ as have/,
    })
    await user.click(haveButtons[0])
    expect(screen.getByTestId('count-have')).toHaveTextContent('1 have tickets')

    const saved = localStorage.getItem(PLANNER_STORAGE_KEY)
    expect(saved).toBeTruthy()
  })
})
