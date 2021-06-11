import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { CreatePostDto } from '../dtos/createPost.dto';
import { UpdatePostDto } from '../dtos/updatePost.dto';
import {
  getAllPostsService,
  createPostService,
  updatePostService,
  deletePostService,
  getPostLikesService,
  postPostLikesService,
} from '../services/post.service';

export const getAllPosts = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const allPosts = await getAllPostsService();
  return res.status(200).json(allPosts);
};

export const createPost = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const postContent = plainToClass(CreatePostDto, req.body);
  const result = await createPostService(req.body.user.id, postContent);
  return res.status(200).json(result);
};

export const updatePost = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const postContent = plainToClass(UpdatePostDto, req.body);
  const result = await updatePostService(
    req.body.user.id,
    req.params.postId,
    postContent,
  );
  return res.status(200).json(result);
};

export const deletePost = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await deletePostService(req.body.user.id, req.params.postId);
  return res.status(200).json(result);
};

export const getPostLikes = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await getPostLikesService(req.params.postId);
  return res.status(200).json(result);
};

export const postPostLikes = async (
  req: Request,
  res: Response,
): Promise<Response<'json'>> => {
  const result = await postPostLikesService(
    req.body.user.id,
    req.params.postId,
    req.body.likeStatus,
  );
  return res.status(200).json(result);
};

//------------------------------------------------------------------------------------------

/* export const getSinglePost = async (req: Request, res: Response): Promise<Response<'json'>> => {
  const result = await getSinglePostService(req.params.postId, req.body.user.id)
  return res.status(200).json(result)
};

export const getUserPosts = async (req: Request, res: Response): Promise<Response<'json'>> => {
  const result = await getUserPostsService(req.body.user.id)
  return res.status(200).json(result)
}; */

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
