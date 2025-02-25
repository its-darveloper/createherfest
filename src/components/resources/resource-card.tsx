"use client"

import { motion } from 'framer-motion'
import { ExternalLink, Clock, Video, BookOpen, Laptop, Code, FileText } from 'lucide-react'
import { typography } from '@/lib/utils/typography'
import type { Resource } from '@/types/sanity'

interface ResourceCardProps {
  resource: Resource
}

// Helper to get the appropriate icon for resource type
const getResourceTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return Video
    case 'reading':
      return BookOpen
    case 'online_course':
      return Laptop
    case 'interactive_tutorial':
      return Code
    default:
      return FileText
  }
}

// Helper to get the appropriate color for resource type
const getResourceTypeColor = (type: string) => {
  switch (type) {
    case 'video':
      return 'bg-blue-100 text-blue-500'
    case 'online_course':
      return 'bg-purple-100 text-purple-500'
    case 'reading':
      return 'bg-green-100 text-green-500'
    case 'interactive_tutorial':
      return 'bg-orange-100 text-orange-500'
    case 'coding_question':
      return 'bg-red-100 text-red-500'
    case 'quiz':
      return 'bg-teal-100 text-teal-500'
    default:
      return 'bg-gray-100 text-gray-500'
  }
}

// Helper to format resource type label
const formatResourceType = (type: string) => {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const ResourceTypeIcon = getResourceTypeIcon(resource.resourceType)
  const typeColor = getResourceTypeColor(resource.resourceType)
  
  return (
    <motion.div
      className="bg-[#1c144d] rounded-xl overflow-hidden border border-white/10 h-full 
               transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-[#473DC6]/10"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Resource Type Badge */}
        <div className="flex items-center mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeColor}`}>
            <ResourceTypeIcon className="w-3 h-3 mr-1" />
            {formatResourceType(resource.resourceType)}
          </span>
          
          {/* Experience Level */}
          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#473DC6]/20 text-white">
            {resource.experienceLevel === 'beginner' ? 'For Beginners' : 
             resource.experienceLevel === 'intermediate' ? 'Intermediate' : 'Advanced'}
          </span>
        </div>
        
        {/* Title and Description */}
        <h3 className={`${typography.heading} text-white mb-2`}>{resource.title}</h3>
        <p className={`${typography.body} text-white/70 mb-4 line-clamp-3`}>{resource.description}</p>
        
        {/* Topics Tags */}
        {resource.topics && resource.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.topics.map(topic => (
              <span 
                key={topic}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/10 text-white/80"
              >
                {topic.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}
        
        {/* Metadata and Link */}
        <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-white/60 mr-2" />
            <span className="text-xs uppercase text-white/60">{resource.estimatedTime}</span>
          </div>
          
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center p-2 bg-[#473DC6]/20 hover:bg-[#473DC6]/40 
                     rounded-full text-white transition-colors duration-200"
            aria-label={`View ${resource.title}`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}