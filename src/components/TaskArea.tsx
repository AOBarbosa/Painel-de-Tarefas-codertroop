'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Task } from './Task'

import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ListChecks } from 'lucide-react'

export interface TaskProps {
  id: string
  content: string
  priority: number
  isCompleted: boolean
}

const taskFormSchema = z.object({
  content: z
    .string()
    .min(3, { message: 'A tarefa precisa ter no minimo 3 letras.' })
    .max(144),
  priority: z
    .number()
    .int()
    .nonnegative()
    .lte(3, { message: 'A tarefa pode ter prioridade ate 5.' }),
})

type TaskFormData = z.infer<typeof taskFormSchema>

const dataLocalStorage = JSON.parse(localStorage.getItem('TASKS') || '[]')

export function TaskArea() {
  const {
    register,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
  })

  const [tasks, setTasks] = useState<TaskProps[]>(dataLocalStorage)
  const [newTaskContent, setNewTaskContent] = useState('')
  const [taskPriority, setTaskPriority] = useState<number>(0)
  const [filter, setFilter] = useState('all') // Pode ser 'all', 'completed', 'incomplete', 'high', 'medium', 'low'

  useEffect(() => {
    localStorage.setItem('TASKS', JSON.stringify(tasks))
  }, [tasks])

  function handleCreateTask(event: FormEvent) {
    event.preventDefault()
    setTasks([
      ...tasks,
      {
        id: uuidv4(),
        content: newTaskContent,
        priority: taskPriority === 0 ? 1 : taskPriority,
        isCompleted: false,
      },
    ])

    setNewTaskContent('')
  }

  function handleNewTaskContent(event: ChangeEvent<HTMLInputElement>) {
    setNewTaskContent(event.target.value)
  }

  function handleNewTaskPriority(event: ChangeEvent<HTMLInputElement>) {
    setTaskPriority(event.target.valueAsNumber)
  }

  function handleCheckTaskAsComplete(id: string) {
    const newTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            isCompleted: !task.isCompleted,
          }
        : task,
    )

    setTasks(newTasks)
  }

  function deleteTask(taskToDeleteId: string) {
    const tasksWithoutDeletedOne = tasks.filter((task) => {
      return task.id !== taskToDeleteId
    })

    setTasks(tasksWithoutDeletedOne)
  }

  function handleEditTask(taskId: string, newText: string) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, content: newText }
      }
      return task
    })

    setTasks(updatedTasks)
  }

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <form onSubmit={handleCreateTask} className="w-full flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <input
            {...register('content')}
            value={newTaskContent}
            onChange={handleNewTaskContent}
            placeholder="Insira uma nova tarefa"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          {errors.content && (
            <span className="text-red-500 text-xs">
              {errors.content.message}
            </span>
          )}

          <div>
            <input
              {...register('priority')}
              placeholder="Prioridade"
              type="number"
              onChange={handleNewTaskPriority}
              className="appearance-none flex h-9 w-28 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            {(taskPriority < 0 || taskPriority > 3) && (
              <span className="text-xs text-red-500">out of range</span>
            )}
            {errors.priority && (
              <span className="text-red-500 text-xs">
                {errors.priority.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            data-testid="add-task-button"
            disabled={
              newTaskContent === '' || taskPriority < 0 || taskPriority > 3
            }
            className="flex justify-center items-center cursor-pointer w-32 h-9 p-2 bg-zinc-50 text-black rounded-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
      </form>

      {/* Separator */}
      <div className="shrink-0 h-[1px] w-full bg-border" />

      {tasks.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-2">
          <ListChecks size={64} />
          <h1 className="text-xl">Todas as tarefas foram concluídas!</h1>
          <span className="text-base text-zinc-500">
            Crie novas tarefas e organize sua lista de afazeres!
          </span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-1 md:flex md:flex-row md:items-center md:justify-center">
            <button
              data-testid="all-tasks-filter"
              className="flex justify-center items-center text-xs md:text-sm cursor-pointer w-auto md:w-28 h-9 p-2 bg-zinc-50 focus:ring-2 focus:ring-blue-500 text-black rounded-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setFilter('all')}
            >
              Todas
            </button>

            <button
              data-testid="completed-tasks-filter"
              className="flex justify-center items-center text-xs md:text-sm cursor-pointer w-auto md:w-28 h-9 p-2 bg-zinc-50 focus:ring-2 focus:ring-blue-500 text-black rounded-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setFilter('completed')}
            >
              Concluídas
            </button>

            <button
              data-testid="incompleted-tasks-filter"
              className="flex justify-center items-center text-xs md:text-sm cursor-pointer w-auto md:w-28 h-9 p-2 bg-zinc-50 focus:ring-2 focus:ring-blue-500 text-black rounded-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setFilter('incomplete')}
            >
              Não Concluídas
            </button>

            <button
              data-testid="high-piority-tasks-filter"
              className="flex justify-center items-center text-xs md:text-sm cursor-pointer w-auto md:w-28 h-9 p-2 bg-zinc-50 focus:ring-2 focus:ring-blue-500 text-black rounded-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setFilter('high')}
            >
              Alta
            </button>

            <button
              data-testid="medium-piority-tasks-filter"
              className="flex justify-center items-center text-xs md:text-sm cursor-pointer w-auto md:w-28 h-9 p-2 bg-zinc-50 focus:ring-2 focus:ring-blue-500 text-black rounded-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setFilter('medium')}
            >
              Média
            </button>

            <button
              data-testid="low-piority-tasks-filter"
              className="flex justify-center items-center text-xs md:text-sm cursor-pointer w-auto md:w-28 h-9 p-2 bg-zinc-50 focus:ring-2 focus:ring-blue-500 text-black rounded-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setFilter('low')}
            >
              Baixa
            </button>
          </div>

          {/* Separator */}
          <div className="shrink-0 h-[1px] w-full bg-border" />

          <div className="w-full h-auto flex flex-col gap-2">
            {tasks
              .filter((task) => {
                if (filter === 'completed') return task.isCompleted
                if (filter === 'incomplete') return !task.isCompleted
                if (filter === 'high') return task.priority === 3
                if (filter === 'medium') return task.priority === 2
                if (filter === 'low')
                  return task.priority === 1 || task.priority === 0
                return true
              })
              .sort((a, b) => b.priority - a.priority)
              .map((task) => {
                return (
                  <Task
                    data-testid="task"
                    key={task.id}
                    id={task.id}
                    content={task.content}
                    priority={task.priority}
                    isCompleted={task.isCompleted}
                    onDeleteTask={deleteTask}
                    onCheck={handleCheckTaskAsComplete}
                    onEditTask={handleEditTask}
                  />
                )
              })}
          </div>
        </>
      )}
    </div>
  )
}
