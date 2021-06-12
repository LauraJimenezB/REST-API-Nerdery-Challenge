import { BaseDto } from './base.dto';
import { Exclude } from 'class-transformer';

export class CommentDto extends BaseDto {
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
  likes: number;
  dislikes: number;
}
