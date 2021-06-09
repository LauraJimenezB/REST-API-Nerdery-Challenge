export class PostDto {
  constructor(
    public id: number,
    public createdAt: Date,
    public updatedAt: Date,
    public title: string,
    public content: string,
    public published: boolean,
    public authorId: number,
    public likeState: string
  ) { }
}