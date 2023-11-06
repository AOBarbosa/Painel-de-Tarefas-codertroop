import { PencilIcon, Trash2 } from 'lucide-react'
import { TaskProps } from './TaskArea'
import { ChangeEvent, useState } from 'react'

interface TaskComponentProps extends TaskProps {
  onDeleteTask: (task: string) => void
  onCheck: (taskId: string) => void
  onEditTask: (id: string, newText: string) => void
}

export function Task({
  id,
  content,
  isCompleted,
  onDeleteTask,
  onCheck,
  onEditTask,
}: TaskComponentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(content)

  function handleDeleteTask() {
    onDeleteTask(id)
  }

  function handleCheck() {
    onCheck(id)
  }

  function handleSaveEdit() {
    onEditTask(id, content)
  }

  function handleEditedContent(event: ChangeEvent<HTMLInputElement>) {
    setEditedText(event.target.value)
  }

  return (
    <form className="flex flex-col items-center gap-2">
      <footer className="flex justify-between items-center h-9 md:h-12 w-full rounded-md border border-input bg-transparent p-2 text-sm md:text-lg shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editedText}
              onChange={handleEditedContent}
              onBlur={handleSaveEdit}
              autoFocus
            />
          </div>
        ) : (
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
        )}

        <div className="flex flex-row gap-2 items-center justify-center">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isCompleted === true}
            className="w-6 md:w-8 h-6 md:h-8 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-transparent text-destructive-foreground shadow-sm hover:bg-primary-foreground/80"
          >
            <PencilIcon className="w-4 md:w-auto h-4 md:h-auto" />
          </button>

          <button
            data-testid="remove-task"
            onClick={handleDeleteTask}
            className="w-6 md:w-8 h-6 md:h-8 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80"
            disabled={isCompleted === true}
          >
            <Trash2 className="w-4 md:w-auto h-4 md:h-auto" />
          </button>
        </div>
      </footer>
    </form>
  )
}
