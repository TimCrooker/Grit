import React from 'react'
import { render, screen } from '@/test'
import { TestComponent } from './index'

it('renders hello world message', () => {
	render(<TestComponent />)
	expect(screen.getByText('Hello World')).toBeInTheDocument()
})
