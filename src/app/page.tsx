'use client'

import { GithubIcon, ListTodo } from 'lucide-react'
import { GoogleLogo } from '@phosphor-icons/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '@/lib/api'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface User {
  id: string
  username: string
  password: string
}

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O usuário pode ter apenas letras e hifens.',
    })
    .transform((username) => username.toLowerCase()),
  password: z
    .string()
    .min(6, { message: 'O nome precisa ter pelo menos 6 letras.' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Home() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/', {
        username: data.username,
        password: data.password,
      })

      await router.push('/tasks')
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message)
        return
      }

      console.error(err)
    }

    console.log(data)
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:px-8 md:px-16 lg:px-40 gap-10">
      {/* <header className="flex flex-row justify-center items-center gap-4 w-screen text-xl">
        <ListTodo className="w-8 sm:w-10 md:w-12 lg:w-14 h-8 sm:h-10 md:h-12 lg:h-14" />
        <h1 className="text-xl sm:text-2xl md:4xl">Painel de tarefas</h1>
      </header>

      <main className="w-full h-full flex flex-col gap-8">
        <TaskArea />
      </main> */}

      <header className="flex flex-row justify-center items-center gap-4 w-screen text-xl">
        <ListTodo className="w-8 sm:w-10 md:w-12 lg:w-14 h-8 sm:h-10 md:h-12 lg:h-14" />
        <h1 className="text-xl sm:text-2xl md:4xl">Painel de tarefas</h1>
      </header>

      <main className="flex flex-col gap-4">
        <h1>Para continuar faça login ou cadastre-se</h1>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleRegister)}
        >
          <label className="flex flex-col gap-1">
            <p>Username</p>
            <input
              {...register('username')}
              type="text"
              placeholder="Insira seu username"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.username && (
              <span className="text-red-500 text-xs">
                {errors.username.message}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1">
            <p>Senha</p>
            <input
              {...register('password')}
              type="password"
              placeholder="Insira sua senha"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </label>

          <div className="flex flex-row gap-2 justify-center">
            <button
              type="submit"
              className="flex justify-center items-center cursor-pointer w-32 h-9 p-2 bg-zinc-50 text-black rounded-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              SignIn
            </button>

            <button
              type="submit"
              className="flex justify-center items-center cursor-pointer w-32 h-9 p-2 bg-zinc-50 text-black rounded-md hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Login
            </button>
          </div>
        </form>

        <div className="flex flex-row gap-2">
          Ou entre com{' '}
          <button>
            <GithubIcon />{' '}
          </button>
          ou{' '}
          <button>
            <GoogleLogo size={32} />
          </button>
        </div>
      </main>
    </div>
  )
}
