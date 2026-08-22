import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { buildSeedPlan } from '../data/planner'
import { VENUES } from '../data/venues'
import VenueMap from './VenueMap'

describe('VenueMap', () => {
  it('shows all-days legend when no day is selected', () => {
    const sessions = buildSeedPlan()
    render(<VenueMap sessions={sessions} selectedDate={null} />)
    const legend = screen.getByTestId('map-legend')
    expect(legend).toHaveTextContent('Have tickets')
    expect(legend).toHaveTextContent('On your plan')
    expect(legend).toHaveTextContent('No sessions yet')
    expect(legend.textContent?.toLowerCase()).not.toContain('today')
    expect(legend.textContent?.toLowerCase()).not.toContain('this day')
  })

  it('uses this-day legend when a day is selected (not "today")', () => {
    const sessions = buildSeedPlan()
    render(<VenueMap sessions={sessions} selectedDate="2028-07-25" />)
    const legend = screen.getByTestId('map-legend')
    expect(legend).toHaveTextContent('Have tickets this day')
    expect(legend).toHaveTextContent('Sessions this day')
    expect(legend).toHaveTextContent('Other venues')
    expect(legend.textContent?.toLowerCase()).not.toContain('today')
  })

  it('renders a pin for every venue regardless of day filter', () => {
    const sessions = buildSeedPlan()
    render(<VenueMap sessions={sessions} selectedDate="2028-07-25" />)
    expect(screen.getByTestId('venue-map')).toHaveAttribute(
      'data-pin-count',
      String(VENUES.length),
    )
  })
})
