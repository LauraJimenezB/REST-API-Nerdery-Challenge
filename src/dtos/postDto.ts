export class PostDto {
  constructor(
    public id: number,
    public title: string,
    public content: string,
    public published: boolean,
    public authorId: number,
    public likeState: string
  ) { }
}