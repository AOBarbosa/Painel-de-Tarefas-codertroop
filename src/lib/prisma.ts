import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const task = await prisma.task.create({
    data: {
      content: 'Beber água',
      isCompleted: false,
      priority: 3,
    },
  })
  console.log(task)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
