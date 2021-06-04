import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function validateUser (id: string): Promise<boolean>{
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      }
    })
    if(user) {
      return true
    } else {
      return false
    }
  } 
  
  async function validatePost (authorId: string, id: string): Promise<boolean>{
    const post = await prisma.post.findFirst({
      where: {
        id: Number(id),
        authorId: Number(authorId)
      }
    })
    if(post) {
      return true
    } else {
      return false
    }
  }
  
  async function validateComment (authorId: string, postId:string, id: string): Promise<boolean>{
    const comment = await prisma.comments.findFirst({
      where: {
        id: Number(id),
        authorId: Number(authorId),
        postId: Number(postId)
      }
    })
    if(comment) {
      return true
    } else {
      return false
    }
  }
  
 const notFound = (type: string, id: string): string => `${type} with ID ${id} does not exist in the database`;
  
export {
    validateUser,
    validatePost,
    validateComment,
    notFound
}