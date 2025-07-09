import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: '4aek51af',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Fetch all posts
export async function getPosts() {
  return await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      link,
      publishedAt,
      "image": image.asset->url
    }
  `);
}

// Fetch all projects
export async function getProjects() {
  return await client.fetch(`
    *[_type == "project"] | order(order asc, title asc) {
      _id,
      title,
      slug,
      order,
      description,
      url,
      tags,
      "image": image.asset->url
    }
  `);
}

// Fetch profile information
export async function getProfile() {
  const profiles = await client.fetch(`
    *[_type == "profile"] {
      name,
      title,
      bio,
      "profileImage": profileImage.asset->url
    }
  `);
  return profiles[0] || null;
}

// Fetch latest resume
export async function getLatestResume() {
  const resumes = await client.fetch(`
    *[_type == "resume"] | order(lastUpdated desc) [0] {
      _id,
      lastUpdated,
      "pdfUrl": pdfFile.asset->url
    }
  `);
  return resumes;
}

// Fetch all links
export async function getLinks() {
  return await client.fetch(`
    *[_type == "link"] | order(order asc) {
      _id,
      displayName,
      url,
      icon
    }
  `);
}
