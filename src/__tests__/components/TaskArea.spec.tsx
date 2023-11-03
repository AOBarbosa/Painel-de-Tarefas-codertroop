import { render, screen, fireEvent } from '@testing-library/react'
import { TaskArea } from '@/components/TaskArea'

describe('Task', () => {
  describe('add tasks', () => {
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
  })

  describe('remove tasks', () => {
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

    it('should not be able to remove a checked task', () => {
      render(<TaskArea />)

      const taskInput = screen.getByPlaceholderText('Insira uma nova tarefa')
      const addTaskButton = screen.getByTestId('add-task-button')

      fireEvent.change(taskInput, {
        target: {
          value: 'Nova tarefa',
        },
      })
      fireEvent.click(addTaskButton)

      const task = screen.getByText('Nova tarefa')
      task.firstChild && fireEvent.click(task.firstChild)

      const removeTaskButton = screen.getByTestId('remove-task')

      expect(task).toBeInTheDocument()
      expect(task).toHaveClass('line-through')
      expect(removeTaskButton).toBeDisabled()
    })
  })

  it('should be able to check a task as completed', () => {
    render(<TaskArea />)

    const taskInput = screen.getByPlaceholderText('Insira uma nova tarefa')
    const addTaskButton = screen.getByTestId('add-task-button')

    fireEvent.change(taskInput, {
      target: {
        value: 'Nova tarefa',
      },
    })
    fireEvent.click(addTaskButton)

    const task = screen.getByText('Nova tarefa')
    task.firstChild && fireEvent.click(task.firstChild)

    expect(task).toBeInTheDocument()
    expect(task).toHaveClass('line-through')
  })
})
