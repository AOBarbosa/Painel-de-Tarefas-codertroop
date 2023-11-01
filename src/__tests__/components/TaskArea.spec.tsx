import { render, screen, fireEvent } from '@testing-library/react'
import { TaskArea } from '@/components/TaskArea'

describe('Task Page', () => {
  it('should be able to add a new task', () => {
    render(<TaskArea />)

    const taskInput = screen.getByPlaceholderText('Insira uma nova tarefa')
    const addTaskButton = screen.getByTestId('add-task-button')

    fireEvent.change(taskInput, {
      target: {
        value: 'Nova tarefa',
      },
    })
    fireEvent.click(addTaskButton)

    const newTaskTitle = screen.getByText('Nova tarefa')

    expect(newTaskTitle).toHaveTextContent('Nova tarefa')
    expect(newTaskTitle.parentElement).not.toHaveClass('line-through')

    fireEvent.change(taskInput, {
      target: {
        value: 'Ler livro',
      },
    })
    fireEvent.click(addTaskButton)

    const addedSecondTaskTitle = screen.getByText('Ler livro')

    expect(newTaskTitle).toBeInTheDocument()
    expect(newTaskTitle).toHaveTextContent('Nova tarefa')
    expect(newTaskTitle.parentElement).not.toHaveClass('line-through')

    expect(addedSecondTaskTitle).toHaveTextContent('Ler livro')
    expect(addedSecondTaskTitle.parentElement).not.toHaveClass('line-through')
  })

  it('should not be able to add an empty task', () => {
    render(<TaskArea />)

    const addTaskButton = screen.getByTestId('add-task-button')
    fireEvent.click(addTaskButton)

    expect(screen.queryByTestId('task')).not.toBeInTheDocument()
  })

  it('should be able to remove a task', () => {
    render(<TaskArea />)

    const taskInput = screen.getByPlaceholderText('Insira uma nova tarefa')
    const addTaskButton = screen.getByTestId('add-task-button')

    fireEvent.change(taskInput, {
      target: {
        value: 'Nova tarefa',
      },
    })
    fireEvent.click(addTaskButton)

    const newTaskTitle = screen.getByText('Nova tarefa')
    expect(newTaskTitle).toBeInTheDocument()

    const removeTaskButton = screen.getByTestId('remove-task')
    fireEvent.click(removeTaskButton)

    expect(newTaskTitle).not.toBeInTheDocument()
  })
})
