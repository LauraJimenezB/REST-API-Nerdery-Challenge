import { BaseDto } from './base.dto';
import { Exclude } from 'class-transformer';

export class CommentNoLikesDto extends BaseDto {
  id: number;
  content: string;
  authorId: number | null;
  @Exclude()
  published: boolean;
  @Exclude()
  postId: number | null;
  @Exclude()
  likedBy: number[];
  @Exclude()
  dislikedBy: number[];
  @Exclude()
  likes: number;
  @Exclude()
  dislikes: number;
}
