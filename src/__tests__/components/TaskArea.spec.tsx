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

  describe('check task', () => {
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

  describe('filter tasks', () => {
    it('should be able to show all tasks', () => {
      render(<TaskArea />)

      const taskInput = screen.getByPlaceholderText('Insira uma nova tarefa')
      const priorityInput = screen.getByPlaceholderText('Prioridade')
      const addTaskButton = screen.getByTestId('add-task-button')

      fireEvent.change(taskInput, {
        target: {
          value: 'Beber água',
        },
      })
      fireEvent.change(priorityInput, {
        target: {
          value: 1,
        },
      })
      fireEvent.click(addTaskButton)

      fireEvent.change(taskInput, {
        target: {
          value: 'Comprar pao',
        },
      })
      fireEvent.change(priorityInput, {
        target: {
          value: 3,
        },
      })
      fireEvent.click(addTaskButton)

      fireEvent.change(taskInput, {
        target: {
          value: 'Almocar',
        },
      })
      fireEvent.click(addTaskButton)
      const thirdTask = screen.getByText('Almocar')
      thirdTask.firstChild && fireEvent.click(thirdTask.firstChild)

      const firstTask = screen.getByText('Beber água')
      const secondTask = screen.getByText('Comprar pao')

      const allTasksButton = screen.getByTestId('all-tasks-filter')

      fireEvent.click(allTasksButton)

      expect(firstTask).toBeInTheDocument()
      expect(secondTask).toBeInTheDocument()
      expect(thirdTask).toHaveClass('line-through')
    })

    it('should be able to show only completed tasks', () => {
      render(<TaskArea />)

      const taskInput = screen.getByPlaceholderText('Insira uma nova tarefa')
      const addTaskButton = screen.getByTestId('add-task-button')

      fireEvent.change(taskInput, {
        target: {
          value: 'Beber água',
        },
      })
      fireEvent.click(addTaskButton)
      const firstTask = screen.getByText('Beber água')
      firstTask.firstChild && fireEvent.click(firstTask.firstChild)

      fireEvent.change(taskInput, {
        target: {
          value: 'Comprar pao',
        },
      })
      fireEvent.click(addTaskButton)
      const secondTask = screen.getByText('Comprar pao')

      expect(firstTask).toBeInTheDocument()
      expect(firstTask).toHaveClass('line-through')
      expect(secondTask).toBeInTheDocument()

      const completedTasksButton = screen.getByTestId('completed-tasks-filter')

      fireEvent.click(completedTasksButton)

      expect(firstTask).toBeInTheDocument()
      expect(secondTask).not.toBeInTheDocument()
    })

    it('should be able to show only incompleted tasks ', () => {
      render(<TaskArea />)

      const taskInput = screen.getByPlaceholderText('Insira uma nova tarefa')
      const addTaskButton = screen.getByTestId('add-task-button')

      fireEvent.change(taskInput, {
        target: {
          value: 'Beber água',
        },
      })
      fireEvent.click(addTaskButton)
      const firstTask = screen.getByText('Beber água')
      firstTask.firstChild && fireEvent.click(firstTask.firstChild)

      fireEvent.change(taskInput, {
        target: {
          value: 'Comprar pao',
        },
      })
      fireEvent.click(addTaskButton)
      const secondTask = screen.getByText('Comprar pao')

      expect(firstTask).toBeInTheDocument()
      expect(firstTask).toHaveClass('line-through')
      expect(secondTask).toBeInTheDocument()

      const incompletedTasksButton = screen.getByTestId(
        'incompleted-tasks-filter',
      )

      fireEvent.click(incompletedTasksButton)

      expect(firstTask).not.toBeInTheDocument()
      expect(secondTask).toBeInTheDocument()
    })

    it('should be able to show only high priority tasks', () => {
      render(<TaskArea />)

      const taskInput = screen.getByPlaceholderText('Insira uma nova tarefa')
      const priorityInput = screen.getByPlaceholderText('Prioridade')
      const addTaskButton = screen.getByTestId('add-task-button')

      fireEvent.change(taskInput, {
        target: {
          value: 'Beber água',
        },
      })

      fireEvent.change(priorityInput, {
        target: {
          value: 3,
        },
      })
      fireEvent.click(addTaskButton)

      fireEvent.change(taskInput, {
        target: {
          value: 'Comprar pao',
        },
      })

      fireEvent.change(priorityInput, {
        target: {
          value: 0,
        },
      })
      fireEvent.click(addTaskButton)

      const firstTask = screen.getByText('Beber água')
      const secondTask = screen.getByText('Comprar pao')

      expect(firstTask).toBeInTheDocument()
      expect(secondTask).toBeInTheDocument()

      const highPriorityTasksButton = screen.getByTestId(
        'high-piority-tasks-filter',
      )

      fireEvent.click(highPriorityTasksButton)

      expect(firstTask).toBeInTheDocument()
      expect(secondTask).not.toBeInTheDocument()
    })

    it('should be able to show only medium priority tasks', () => {
      render(<TaskArea />)

      const taskInput = screen.getByPlaceholderText('Insira uma nova tarefa')
      const priorityInput = screen.getByPlaceholderText('Prioridade')
      const addTaskButton = screen.getByTestId('add-task-button')

      fireEvent.change(taskInput, {
        target: {
          value: 'Beber água',
        },
      })

      fireEvent.change(priorityInput, {
        target: {
          value: 2,
        },
      })
      fireEvent.click(addTaskButton)

      fireEvent.change(taskInput, {
        target: {
          value: 'Comprar pao',
        },
      })

      fireEvent.change(priorityInput, {
        target: {
          value: 3,
        },
      })
      fireEvent.click(addTaskButton)

      const firstTask = screen.getByText('Beber água')
      const secondTask = screen.getByText('Comprar pao')

      expect(firstTask).toBeInTheDocument()
      expect(secondTask).toBeInTheDocument()

      const mediumPriorityTasksButton = screen.getByTestId(
        'medium-piority-tasks-filter',
      )

      fireEvent.click(mediumPriorityTasksButton)

      expect(firstTask).toBeInTheDocument()
      expect(secondTask).not.toBeInTheDocument()
    })

    it('should be able to show only low priority tasks', () => {
      render(<TaskArea />)

      const taskInput = screen.getByPlaceholderText('Insira uma nova tarefa')
      const priorityInput = screen.getByPlaceholderText('Prioridade')
      const addTaskButton = screen.getByTestId('add-task-button')

      fireEvent.change(taskInput, {
        target: {
          value: 'Beber água',
        },
      })

      fireEvent.change(priorityInput, {
        target: {
          value: 1,
        },
      })
      fireEvent.click(addTaskButton)

      fireEvent.change(taskInput, {
        target: {
          value: 'Comprar pao',
        },
      })

      fireEvent.change(priorityInput, {
        target: {
          value: 3,
        },
      })
      fireEvent.click(addTaskButton)

      const firstTask = screen.getByText('Beber água')
      const secondTask = screen.getByText('Comprar pao')

      expect(firstTask).toBeInTheDocument()
      expect(secondTask).toBeInTheDocument()

      const lowPriorityTasksButton = screen.getByTestId(
        'low-piority-tasks-filter',
      )

      fireEvent.click(lowPriorityTasksButton)

      expect(firstTask).toBeInTheDocument()
      expect(secondTask).not.toBeInTheDocument()
    })
  })
})
