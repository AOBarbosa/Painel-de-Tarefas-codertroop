'use client'

import { TaskArea } from '@/components/TaskArea'
import { ListTodo } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:px-8 md:px-16 lg:px-40 gap-10">
      <header className="flex flex-row justify-center items-center gap-4 w-screen text-xl">
        <ListTodo className="w-8 sm:w-10 md:w-12 lg:w-14 h-8 sm:h-10 md:h-12 lg:h-14" />
        <h1 className="text-xl sm:text-2xl md:4xl">Painel de tarefas</h1>
      </header>

      <main className="w-full h-full flex flex-col gap-8">
        <TaskArea />
      </main>
    </div>
  )
}
