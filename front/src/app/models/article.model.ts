export interface ArticleDto {
    id?: number;
    title: string;
    content: string;
    authorUsername: string;
    createdAt?: string;
    updatedAt?: string;
    comments?: Array<{ username: string; content: string }>; 
    topic?:string;
  }
  