import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req

  switch (method) {
    case 'GET': {
      const tasks = await prisma.task.findMany({})

      return res.status(200).json(tasks)
    }

    case 'POST': {
      const task = await prisma.task.create({
        data: { ...body },
      })

      return res.status(201).json(task)
    }

    default:
      return res.status(405).end()
  }
}
