import { ChangeEvent, FormEvent, useState } from 'react'
import { Task } from './Task'
import { v4 as uuidv4 } from 'uuid'

export interface TaskProps {
  id: string
  content: string
  priority?: number
  isCompleted: boolean
}

export function TaskArea() {
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
        priority: taskPriority !== 0 ? taskPriority : 0,
        isCompleted: false,
      },
    ])

    setNewTaskContent('')
    setTaskPriority(0)
  }

  function handleNewTaskContent(event: ChangeEvent<HTMLInputElement>) {
    setNewTaskContent(event.target.value)
  }

  function handleNewTaskPriority(event: ChangeEvent<HTMLInputElement>) {
    setTaskPriority(event.target.valueAsNumber)
  }

  function handleCheckTaskAsComplete(id: string) {
    setTasks((tasks) =>
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            isCompleted: true,
          }
        }

        return task
      }),
    )
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
            value={newTaskContent}
            onChange={handleNewTaskContent}
            placeholder="Insira uma nova tarefa"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />

          <input
            placeholder="Prioridade"
            type="number"
            onChange={handleNewTaskPriority}
            className="appearance-none flex h-9 w-28 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          className="flex justify-center items-center cursor-pointer w-auto h-9 p-2 bg-zinc-50 text-black rounded-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Adicionar
        </button>
      </form>

      {/* Separator */}
      <div className="shrink-0 h-[1px] w-full bg-border" />

      <div className="w-full h-auto flex flex-col gap-2">
        {tasks.map((task) => {
          return (
            <Task
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
