import '@testing-library/dom'

import { expect, test, vi } from 'vitest'
import { Todo } from '../src/Todos/Todo'
import { render, screen } from '@testing-library/react'

test('todo shows its text', () => {
    render(
        <Todo
            todo={{ text: 'hello world', done: false }}
            onClickComplete={vi.fn()}
            onClickDelete={vi.fn()}
        />
    )

    expect(screen.getByText('hello world')).toBeDefined()

})
