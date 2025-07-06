import {
  getPosts,
  getProjects,
  getProfile,
  getLinks,
  getLatestResume,
} from './sanity';

// Cache interfaces
interface Post {
  _id: string;
  title: string;
  excerpt: string;
  link: string;
  publishedAt: string;
  image: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  url?: string;
  tags: string[];
  image?: string;
}

interface Profile {
  name: string;
  title: string;
  bio: string;
  profileImage: string;
}

interface Link {
  _id: string;
  displayName: string;
  url: string;
  icon?: string;
}

interface Resume {
  _id: string;
  lastUpdated: string;
  pdfUrl: string;
}

// Global cache storage
const cache = {
  posts: null as Post[] | null,
  projects: null as Project[] | null,
  profile: null as Profile | null,
  links: null as Link[] | null,
  resume: null as Resume | null,
};

// Promise storage to prevent duplicate requests
const promises = {
  posts: null as Promise<Post[]> | null,
  projects: null as Promise<Project[]> | null,
  profile: null as Promise<Profile | null> | null,
  links: null as Promise<Link[]> | null,
  resume: null as Promise<Resume | null> | null,
};

// Cache functions
export async function getCachedPosts(): Promise<Post[]> {
  if (cache.posts) {
    return cache.posts;
  }

  if (promises.posts) {
    return await promises.posts;
  }

  promises.posts = getPosts();
  const data = await promises.posts;
  cache.posts = data;
  return data;
}

export async function getCachedProjects(): Promise<Project[]> {
  if (cache.projects) {
    return cache.projects;
  }

  if (promises.projects) {
    return await promises.projects;
  }

  promises.projects = getProjects();
  const data = await promises.projects;
  cache.projects = data;
  return data;
}

export async function getCachedProfile(): Promise<Profile | null> {
  if (cache.profile) {
    return cache.profile;
  }

  if (promises.profile) {
    return await promises.profile;
  }

  promises.profile = getProfile();
  const data = await promises.profile;
  cache.profile = data;
  return data;
}

export async function getCachedLinks(): Promise<Link[]> {
  if (cache.links) {
    return cache.links;
  }

  if (promises.links) {
    return await promises.links;
  }

  promises.links = getLinks();
  const data = await promises.links;
  cache.links = data;
  return data;
}

export async function getCachedResume(): Promise<Resume | null> {
  if (cache.resume) {
    return cache.resume;
  }

  if (promises.resume) {
    return await promises.resume;
  }

  promises.resume = getLatestResume();
  const data = await promises.resume;
  cache.resume = data;
  return data;
}

// Function to clear cache (useful for development or when you need fresh data)
export function clearCache() {
  cache.posts = null;
  cache.projects = null;
  cache.profile = null;
  cache.links = null;
  cache.resume = null;

  promises.posts = null;
  promises.projects = null;
  promises.profile = null;
  promises.links = null;
  promises.resume = null;
}

// Function to preload all data (useful for initial page load)
export async function preloadAllData() {
  await Promise.all([
    getCachedPosts(),
    getCachedProjects(),
    getCachedProfile(),
    getCachedLinks(),
    getCachedResume(),
  ]);
}
