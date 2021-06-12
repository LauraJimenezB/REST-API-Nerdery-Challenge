import { BaseDto } from './base.dto';
import { Exclude } from 'class-transformer';

export class CommentWithLikesDto extends BaseDto {
  id: number;
  content: string;
  authorId: number | null;
  @Exclude()
  published: boolean;
  @Exclude()
  postId: number | null;
  likedBy: number[];
  dislikedBy: number[];
  likes: number;
  dislikes: number;
}
