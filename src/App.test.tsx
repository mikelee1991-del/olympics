import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { clearPlannerStorage, PLANNER_STORAGE_KEY } from './data/planner'

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
    expect(screen.getByTestId('count-free')).toHaveTextContent(/free/)
    expect(screen.getByTestId('count-boat')).toHaveTextContent(/boat/)
    // Free course day Jul 19 (time trial) and boat day Jul 15 (surfing)
    expect(
      screen.getByRole('gridcell', { name: /Jul 19.*free/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('gridcell', { name: /Jul 15.*boat/i }),
    ).toBeInTheDocument()
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

  it('hard reset clears planner storage and reloads', async () => {
    const user = userEvent.setup()
    localStorage.setItem(PLANNER_STORAGE_KEY, '[]')
    localStorage.setItem('olympics-planner-v1', '[]')
    const reload = vi.fn()
    vi.stubGlobal('confirm', () => true)
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload },
    })

    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Sessions' }))
    await user.click(screen.getByTestId('hard-reset'))

    expect(localStorage.getItem(PLANNER_STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem('olympics-planner-v1')).toBeNull()
    expect(reload).toHaveBeenCalled()

    vi.unstubAllGlobals()
  })
})

describe('clearPlannerStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('removes current and legacy planner keys', () => {
    localStorage.setItem(PLANNER_STORAGE_KEY, '[]')
    localStorage.setItem('olympics-planner-v1', '[]')
    localStorage.setItem('olympics-planner-v2-official', '[]')
    localStorage.setItem('olympics-watchlist', '["USA"]')
    clearPlannerStorage()
    expect(localStorage.getItem(PLANNER_STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem('olympics-planner-v1')).toBeNull()
    expect(localStorage.getItem('olympics-planner-v2-official')).toBeNull()
    expect(localStorage.getItem('olympics-watchlist')).toBe('["USA"]')
  })
})
