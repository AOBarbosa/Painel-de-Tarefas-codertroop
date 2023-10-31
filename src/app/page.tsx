'use client'

import { TaskArea } from '@/components/TaskArea'
import { ListTodo } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-10">
      <header className="flex flex-row justify-center gap-4 w-screen text-xl">
        <h1>Painel de tarefas</h1>
        <ListTodo size={28} />
      </header>

      <main className="w-full h-full flex flex-col gap-8">
        <TaskArea />
      </main>
    </div>
  )
}
