import { ChangeEvent, FormEvent, useState } from 'react'
import { Task } from './Task'

import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export interface TaskProps {
  id: string
  content: string
  priority: number
  isCompleted: boolean
}

const taskFormSchema = z.object({
  content: z
    .string({ required_error: 'The tasks content is required' })
    .max(144),
  priority: z.number().int().nonnegative().lte(5),
})

type TaskFormData = z.infer<typeof taskFormSchema>

export function TaskArea() {
  const {
    register,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
  })

  const [tasks, setTasks] = useState<TaskProps[]>([])
  const [newTaskContent, setNewTaskContent] = useState('')
  const [taskPriority, setTaskPriority] = useState(0)

  function handleCreateTask(event: FormEvent) {
    event.preventDefault()
    setTasks([
      ...tasks,
      {
        id: uuidv4(),
        content: newTaskContent,
        priority: taskPriority,
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
          </div>
        </div>

        <button
          type="submit"
          data-testid="add-task-button"
          disabled={
            newTaskContent === '' || taskPriority < 0 || taskPriority > 3
          }
          className="flex justify-center items-center cursor-pointer w-auto h-9 p-2 bg-zinc-50 text-black rounded-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Adicionar
        </button>
      </form>

      {/* Separator */}
      <div className="shrink-0 h-[1px] w-full bg-border" />

      <div className="w-full h-auto flex flex-col gap-2">
        {tasks
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
              />
            )
          })}
      </div>
    </div>
  )
}
