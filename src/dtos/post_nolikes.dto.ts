import { BaseDto } from './base.dto';
import { Exclude } from 'class-transformer';

export class PostNoLikesDto extends BaseDto {
  id: number;
  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date | null;
  title: string;
  content: string;
  published: boolean;
  @Exclude()
  authorId: number | null;
  @Exclude()
  likedBy: number[];
  @Exclude()
  dislikedBy: number[];
  @Exclude()
  likes: number;
  @Exclude()
  dislikes: number;
}