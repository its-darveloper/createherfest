// src/hooks/useSanityData.ts
import { useQuery } from '@tanstack/react-query'
import { client } from '@/lib/sanity'
import type { FAQ, Workshop, Partner } from '@/types/sanity'

export const useFAQs = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const faqs = await client.fetch<FAQ[]>(`
        *[_type == "faq"] | order(order asc) {
          _id,
          _type,
          question,
          answer,
          category,
          order
        }
      `)
      return faqs
    }
  })
}

export const useWorkshops = () => {
  return useQuery({
    queryKey: ['workshops'],
    queryFn: async () => {
      const workshops = await client.fetch<Workshop[]>(`
        *[_type == "workshop"] | order(date asc) {
          _id,
          _type,
          title,
          description,
          date,
          duration,
          track,
          speaker->{
            _id,
            name,
            title,
            company,
            bio,
            image
          }
        }
      `)
      return workshops
    }
  })
}

export const usePartners = () => {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const partners = await client.fetch<Partner[]>(`
        *[_type == "partner"] | order(order asc) {
          _id,
          _type,
          name,
          logo,
          website,
          tier
        }
      `)
      return partners
    }
  })
}