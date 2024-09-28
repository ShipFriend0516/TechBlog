interface Post {
  title: string;
  subTitle?: string;
  author: string;
  date: number;
  timeToRead: number;
  content: string;
  comment?: string[];
}

export { Post };
