import { BaseDto } from './base.dto';
import { Exclude } from 'class-transformer';

export class PostWithLikesDto extends BaseDto {
  id: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date | null;
  title: string;
  content: string;
  @Exclude()
  published: boolean;
  @Exclude()
  authorId: number | null;
  likes: number;
  likedBy: number[];
  dislikes: number;
  dislikedBy: number[];
}
