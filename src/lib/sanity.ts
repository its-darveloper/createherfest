// src/lib/sanity.ts

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { FAQ, Speaker, Workshop, Partner, Mentor } from '@/types/sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-02-07',
  useCdn: process.env.NODE_ENV === 'production'
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export async function getSpeakers(): Promise<Speaker[]> {
  return client.fetch(`
    *[_type == "speaker"] {
      _id,
      _type,
      name,
      pronouns,
      title,
      company,
      bio,
      image
    } | order(name asc)
  `)
}

export async function getFAQs(): Promise<FAQ[]> {
  return client.fetch(`
    *[_type == "faq"] {
      _id,
      _type,
      question,
      answer,
      category,
      order
    } | order(category asc, order asc)
  `)
}

export async function getRecentWorkshops(): Promise<Workshop[]> {
  const now = new Date().toISOString(); // Get current date and time in ISO format

  return client.fetch(`
    *[_type == "workshop" && date > $now] { // Filter for workshops with dates in the future
      _id,
      _type,
      title,
      description,
      date,
      duration,
      track,
      workshopUrl,
      "speaker": speaker->{
        _id,
        name,
        pronouns,
        title,
        company,
        bio,
        image
      }
    } | order(date asc)[0...4] // Order by date and limit to the next 4
  `, { now }); // Pass the current date as a parameter
}

export async function getPartners(): Promise<Partner[]> {
  return client.fetch(`
    *[_type == "partner"] {
      _id,
      _type,
      name,
      logo,
      website
    }
  `)
}

export async function getWorkshops(): Promise<Workshop[]> {
  return client.fetch(`
    *[_type == "workshop"] {
      _id,
      title,
      description,
      date,
      duration,
      track,
      workshopUrl,
      "speaker": speaker->{
        _id,
        name,
        pronouns,
        title,
        company,
        bio,
        image
      }
    } | order(date asc)
  `)
}

export async function getMentors(): Promise<Mentor[]> {
  return client.fetch(`
    *[_type == "mentor"] {
      _id,
      _type,
      name,
      headshot,
      bio,
      expertise,
      tracks,
      linkedinUrl,
      title,
      company,
      availability,
      email
    } | order(name asc)
  `)
}

export async function getMentor(id: string): Promise<Mentor | undefined> {
  return client.fetch(`
    *[_type == "mentor" && _id == $id][0] {
      _id,
      _type,
      name,
      headshot,
      bio,
      expertise,
      tracks,
      linkedinUrl,
      title,
      company,
      availability,
      email
    }
  `, { id })
}