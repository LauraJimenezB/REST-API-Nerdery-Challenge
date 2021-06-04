import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const newUser = await prisma.user.create({
    data: {
      username: 'Laura',
      email: 'laura@prueba.com',
      password: '123'
    }
  })
  
  const users = await prisma.user.findMany()
  console.log(users)
}

main()


