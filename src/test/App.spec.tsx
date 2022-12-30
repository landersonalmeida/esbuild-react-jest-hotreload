import { render, screen } from '@testing-library/react'
import React from 'react'

import App from '../App'

describe('App tests', () => {
  it('should get the heading by role correctly', () => {
    render(<App />)

    const heading = screen.getByRole('heading')

    expect(heading.textContent).toBe('Hello Esbuild! :)')
  })
})
