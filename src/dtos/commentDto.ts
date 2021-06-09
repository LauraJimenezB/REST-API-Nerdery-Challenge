export class CommentDto {
  constructor(
    public id: number,
    public content: string,
    public likeState: string,
    public published: string,
    public authorId: number,
    public postId: number
  ) {}
} 