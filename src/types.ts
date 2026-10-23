export interface Project {
  id?: string;
  title: string;
  image: string;
  tech: string;
  live: string;
  github: string;
  description: string;
}

export type Theme = 'dark' | 'light';
