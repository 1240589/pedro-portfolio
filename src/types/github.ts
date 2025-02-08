export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  topics: string[];
  updated_at: string;
  fork: boolean;
  private: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  topics: string[];
  updatedAt: Date;
}
