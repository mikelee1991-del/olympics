import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { clearPlannerStorage, PLANNER_STORAGE_KEY } from './data/planner'

describe('Split planner views', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('shows Olympics and Paralympics on one calendar', () => {
    render(<App />)
    expect(screen.getByTestId('calendar-view')).toBeInTheDocument()
    const cal = screen.getByTestId('month-calendar')
    expect(cal).toHaveTextContent('July & August 2028')
    expect(screen.getByTestId('cal-month-jul')).toHaveTextContent(
      'July 2028 · Olympics',
    )
    expect(screen.getByTestId('cal-month-aug')).toHaveTextContent(
      'August 2028 · Paralympics',
    )
    expect(screen.getByTestId('ticket-jump')).toBeInTheDocument()
    expect(screen.getByTestId('ticket-jump')).toHaveTextContent(
      /Archery|Handball|Canoe/i,
    )
    expect(
      screen.getByRole('gridcell', { name: /Jul 25.*have tickets/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('gridcell', { name: /Jul 19.*free:/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('gridcell', { name: /Jul 16.*free:.*Sailing · boat/i }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('para-banner')).toHaveTextContent(
      /No Paralympic tickets yet/i,
    )
    expect(screen.getByTestId('count-want-para').textContent).toMatch(/\d+ want/)
  })

  it('splits ticket holders from wishlist people in the day agenda', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole('gridcell', { name: /Jul 25.*have tickets/i }),
    )
    expect(screen.getByTestId('day-people-tickets')).toHaveTextContent(
      /Tickets:/,
    )

    const augCell = screen.getAllByRole('gridcell', { name: /Aug 15/i })[0]
    await user.click(augCell)
    expect(screen.getByTestId('day-people-want')).toHaveTextContent(/Want:/)
    expect(screen.queryByTestId('day-people-tickets')).not.toBeInTheDocument()
    expect(screen.queryByTestId('day-people-going')).not.toBeInTheDocument()
  })

  it('shows combined ticket and want counts for both games', () => {
    render(<App />)
    expect(
      Number.parseInt(
        screen.getByTestId('count-have-oly').textContent?.match(/\d+/)?.[0] ??
          '0',
        10,
      ),
    ).toBeGreaterThanOrEqual(3)
    expect(
      Number.parseInt(
        screen.getByTestId('count-want-para').textContent?.match(/\d+/)?.[0] ??
          '0',
        10,
      ),
    ).toBeGreaterThan(0)
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
    for (const label of ['Calendar', 'Sessions', 'Map', 'Conflicts']) {
      expect(
        within(nav).getByRole('button', { name: label }),
      ).toBeInTheDocument()
    }

    await user.click(within(nav).getByRole('button', { name: 'Map' }))
    expect(screen.getByTestId('map-view')).toBeInTheDocument()
    expect(screen.getByTestId('venue-map')).toBeInTheDocument()
    const legend = screen.getByTestId('map-legend')
    expect(legend).toHaveTextContent(/Have tickets/i)
    expect(legend).toHaveTextContent(/Other venues|No sessions yet/i)
    expect(legend.textContent?.toLowerCase()).not.toContain('today')
    expect(screen.getByTestId('venue-map')).toHaveAttribute(
      'data-pin-count',
      expect.stringMatching(/^\d+$/),
    )

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
    localStorage.setItem('other-app-key', 'keep')
    clearPlannerStorage()
    expect(localStorage.getItem(PLANNER_STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem('olympics-planner-v1')).toBeNull()
    expect(localStorage.getItem('olympics-planner-v2-official')).toBeNull()
    expect(localStorage.getItem('other-app-key')).toBe('keep')
  })
})
