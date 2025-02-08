import { GitHubRepo, Project } from '../types/github';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || '1240589';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export async function getGithubProjects(): Promise<Project[]> {
  try {
    console.log('Fetching GitHub projects...');
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    // Only add authorization header if token is available
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos`, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API Error Response:', errorText);
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
    }

    const repos: GitHubRepo[] = await response.json();
    console.log('Raw GitHub response:', repos);

    if (!Array.isArray(repos)) {
      console.error('Invalid response format:', repos);
      throw new Error('Invalid response format from GitHub API');
    }

    const projects = repos
      .filter(repo => !repo.fork && !repo.private)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .map(repo => ({
        id: repo.id,
        title: repo.name,
        description: repo.description || 'No description available',
        stars: repo.stargazers_count,
        language: repo.language || 'Not specified',
        url: repo.html_url,
        topics: repo.topics || [],
        updatedAt: new Date(repo.updated_at)
      }));

    console.log('Processed projects:', projects);
    return projects;
  } catch (error) {
    console.error('Detailed error in getGithubProjects:', error);
    throw error;
  }
}
