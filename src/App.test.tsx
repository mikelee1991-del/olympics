import { cleanup, render, screen, within } from '@testing-library/react'
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

describe('Split planner views', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('shows a July 2028 calendar by default', () => {
    render(<App />)
    expect(screen.getByTestId('calendar-view')).toBeInTheDocument()
    expect(screen.getByTestId('month-calendar')).toHaveTextContent('July 2028')
  })

  it('opens sessions view and toggles ticket status', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Sessions' }))
    expect(screen.getByTestId('sessions-view')).toBeInTheDocument()

    const daySelect = screen.getByLabelText('Day')
    await user.selectOptions(daySelect, '')

    const list = screen.getByTestId('session-list')
    const firstCard = within(list).getAllByRole('article')[0]
    await user.click(
      within(firstCard).getByRole('button', { name: /Mark .+ as have/ }),
    )

    await user.click(
      within(screen.getByRole('group', { name: 'Ticket filter' })).getByRole(
        'button',
        { name: 'have' },
      ),
    )
    expect(
      screen.getByTestId('session-list').querySelectorAll('article').length,
    ).toBeGreaterThan(0)
    expect(localStorage.getItem(PLANNER_STORAGE_KEY)).toBeTruthy()
  }, 15_000)

  it('navigates to map and conflicts views', async () => {
    const user = userEvent.setup()
    render(<App />)

    const nav = screen.getByRole('navigation', { name: 'Primary' })
    await user.click(within(nav).getByRole('button', { name: 'Map' }))
    expect(screen.getByTestId('map-view')).toBeInTheDocument()
    expect(screen.getByTestId('venue-map')).toBeInTheDocument()

    await user.click(within(nav).getByRole('button', { name: 'Conflicts' }))
    expect(screen.getByTestId('conflicts-view')).toBeInTheDocument()
  })
})
