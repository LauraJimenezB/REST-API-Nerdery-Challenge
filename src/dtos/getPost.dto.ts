import { BaseDto } from './base.dto';

export class GetPostDto extends BaseDto {
  public id: number;
  public title: string;
  public content: string;
  public published: boolean;
  public authorId: number;
  public likeState: string;
}
