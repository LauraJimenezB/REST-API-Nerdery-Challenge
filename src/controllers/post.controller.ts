import { Request, Response } from 'express';
import { 
  getAllPostsService, 
  createSinglePostService, 
  updateSinglePostService, 
  deleteSinglePostService,
  getSinglePostService,
  getPostsService
} from '../services/post.service'

export const getAllPosts = async (req: Request, res: Response): Promise<Response<"json">> => {
  const allPosts = await getAllPostsService()
  return res.status(200).json(allPosts)
};

export const createSinglePost = async (req: Request, res: Response): Promise<Response<'json'>> => {
  const result = await createSinglePostService(req.body, req.body.user.id)
  return res.status(200).json(result)
};

export const updateSinglePost = async (req: Request, res: Response): Promise<Response<'json'>> => {
  const result = await updateSinglePostService(req.params.postId, req.body)
  return res.status(200).json(result)
};

export const deleteSinglePost = async (req: Request, res: Response): Promise<Response<'json'>> => {
  const result = await deleteSinglePostService(req.params.postId)
  return res.status(200).json(result)
};

//------------------------------------------------------------------------------------------

export const getSinglePost = async (req: Request, res: Response): Promise<Response<'json'>> => {
  const result = await getSinglePostService(req.params.postId, req.body.user.id)
  return res.status(200).json(result)
};

export const getPosts = async (req: Request, res: Response): Promise<Response<'json'>> => {
  const result = await getPostsService(req.body.user.id)
  return res.status(200).json(result)
};


/* const getValidatePost = async (postId: string) => {
    const result = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (result) return result;
    else throw new Error(`${postId} not exist`);
  };
 */
