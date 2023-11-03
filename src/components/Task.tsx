import { PencilIcon, Trash2 } from 'lucide-react'
import { TaskProps } from './TaskArea'

interface TaskComponentProps extends TaskProps {
  onDeleteTask: (task: string) => void
  onCheck: (taskId: string) => void
}

export function Task({
  id,
  content,
  isCompleted,
  onDeleteTask,
  onCheck,
}: TaskComponentProps) {
  function handleDeleteTask() {
    onDeleteTask(id)
  }

  function handleCheck() {
    onCheck(id)
  }

  return (
    <form className="flex flex-col items-center gap-2">
      <footer className="flex justify-between h-9 w-full rounded-md border border-input bg-transparent p-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ">
        <label
          className={
            isCompleted
              ? 'line-through text-secondary cursor-pointer'
              : 'cursor-pointer'
          }
        >
          {content}
          <input
            type="checkbox"
            onChange={handleCheck}
            className="appearance-none"
          />
        </label>

        <div className="flex flex-row gap-2 items-center justify-center">
          <button>
            <PencilIcon />
          </button>

          <button
            data-testid="remove-task"
            onClick={handleDeleteTask}
            className="w-6 h-6 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80"
            disabled={isCompleted === true}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </footer>
    </form>
  )
}
