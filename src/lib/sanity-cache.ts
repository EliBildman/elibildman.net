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
  order: number;
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

// Cache entry with timestamp
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache configuration
const CACHE_DURATION = {
  posts: 5 * 60 * 1000, // 5 minutes
  projects: 5 * 60 * 1000, // 5 minutes
  profile: 10 * 60 * 1000, // 10 minutes
  links: 10 * 60 * 1000, // 10 minutes
  resume: 1 * 60 * 1000, // 1 minute (resume changes frequently)
};

// Global cache storage with timestamps
const cache = {
  posts: null as CacheEntry<Post[]> | null,
  projects: null as CacheEntry<Project[]> | null,
  profile: null as CacheEntry<Profile | null> | null,
  links: null as CacheEntry<Link[]> | null,
  resume: null as CacheEntry<Resume | null> | null,
};

// Promise storage to prevent duplicate requests
const promises = {
  posts: null as Promise<Post[]> | null,
  projects: null as Promise<Project[]> | null,
  profile: null as Promise<Profile | null> | null,
  links: null as Promise<Link[]> | null,
  resume: null as Promise<Resume | null> | null,
};

// Helper function to check if cache is still valid
function isCacheValid<T>(
  cacheEntry: CacheEntry<T> | null,
  duration: number
): boolean {
  if (!cacheEntry) return false;
  return Date.now() - cacheEntry.timestamp < duration;
}

// Helper function to fetch from API
async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`/api/${endpoint}`, {
    cache: 'no-store', // Disable Next.js caching for fresh data
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }
  return response.json();
}

// Cache functions with automatic expiration
export async function getCachedPosts(): Promise<Post[]> {
  if (isCacheValid(cache.posts, CACHE_DURATION.posts)) {
    return cache.posts!.data;
  }

  if (promises.posts) {
    return await promises.posts;
  }

  promises.posts = fetchFromAPI<Post[]>('posts');
  const data = await promises.posts;
  cache.posts = { data, timestamp: Date.now() };
  return data;
}

export async function getCachedProjects(): Promise<Project[]> {
  if (isCacheValid(cache.projects, CACHE_DURATION.projects)) {
    return cache.projects!.data;
  }

  if (promises.projects) {
    return await promises.projects;
  }

  promises.projects = fetchFromAPI<Project[]>('projects');
  const data = await promises.projects;
  cache.projects = { data, timestamp: Date.now() };
  return data;
}

export async function getCachedProfile(): Promise<Profile | null> {
  if (isCacheValid(cache.profile, CACHE_DURATION.profile)) {
    return cache.profile!.data;
  }

  if (promises.profile) {
    return await promises.profile;
  }

  promises.profile = fetchFromAPI<Profile | null>('profile');
  const data = await promises.profile;
  cache.profile = { data, timestamp: Date.now() };
  return data;
}

export async function getCachedLinks(): Promise<Link[]> {
  if (isCacheValid(cache.links, CACHE_DURATION.links)) {
    return cache.links!.data;
  }

  if (promises.links) {
    return await promises.links;
  }

  promises.links = fetchFromAPI<Link[]>('links');
  const data = await promises.links;
  cache.links = { data, timestamp: Date.now() };
  return data;
}

export async function getCachedResume(): Promise<Resume | null> {
  if (isCacheValid(cache.resume, CACHE_DURATION.resume)) {
    return cache.resume!.data;
  }

  if (promises.resume) {
    return await promises.resume;
  }

  promises.resume = fetchFromAPI<Resume | null>('resume');
  const data = await promises.resume;
  cache.resume = { data, timestamp: Date.now() };
  return data;
}

// Function to force refresh specific data types
export async function refreshResume(): Promise<Resume | null> {
  cache.resume = null;
  promises.resume = null;
  return await getCachedResume();
}

export async function refreshPosts(): Promise<Post[]> {
  cache.posts = null;
  promises.posts = null;
  return await getCachedPosts();
}

export async function refreshProjects(): Promise<Project[]> {
  cache.projects = null;
  promises.projects = null;
  return await getCachedProjects();
}

export async function refreshProfile(): Promise<Profile | null> {
  cache.profile = null;
  promises.profile = null;
  return await getCachedProfile();
}

export async function refreshLinks(): Promise<Link[]> {
  cache.links = null;
  promises.links = null;
  return await getCachedLinks();
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

// Function to clear specific cache types
export function clearCacheByType(
  type: 'posts' | 'projects' | 'profile' | 'links' | 'resume'
) {
  cache[type] = null;
  promises[type] = null;
}

// Function to clear all caches and return fresh data
export async function refreshAllData() {
  clearCache();
  return await preloadAllData();
}
