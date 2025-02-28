"use client"

import { motion } from 'framer-motion'
import { ExternalLink, Clock, Video, BookOpen, Laptop, Code, FileText, Sparkles, Zap, BookMarked } from 'lucide-react'
import { typography } from '@/lib/utils/typography'
import type { Resource } from '@/types/sanity'

interface ResourceCardProps {
  resource: Resource
  index: number
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
    case 'coding_question':
      return FileText
    case 'quiz':
      return BookMarked
    default:
      return FileText
  }
}

// Helper to get the appropriate gradient for resource type
const getResourceTypeGradient = (type: string) => {
  switch (type) {
    case 'video':
      return 'from-[#3b82f6] to-[#1d4ed8]'
    case 'online_course':
      return 'from-[#8b5cf6] to-[#6d28d9]'
    case 'reading':
      return 'from-[#10b981] to-[#047857]'
    case 'interactive_tutorial':
      return 'from-[#f59e0b] to-[#d97706]'
    case 'coding_question':
      return 'from-[#ef4444] to-[#b91c1c]'
    case 'quiz':
      return 'from-[#14b8a6] to-[#0d9488]'
    default:
      return 'from-[#6b7280] to-[#4b5563]'
  }
}

// Helper to format resource type label
const formatResourceType = (type: string) => {
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

// Get experience level label and color
const getExperienceLevel = (level: string) => {
  switch (level) {
    case 'beginner':
      return { 
        label: 'For Beginners', 
        gradient: 'from-[#cfe6ff] to-[#95c2ff]',
        icon: <Sparkles className="w-3 h-3 mr-1" /> 
      }
    case 'intermediate':
      return { 
        label: 'Intermediate', 
        gradient: 'from-[#caa3d6] to-[#b37fc6]',
        icon: <Zap className="w-3 h-3 mr-1" /> 
      }
    case 'advanced':
      return { 
        label: 'Advanced', 
        gradient: 'from-[#473dc6] to-[#6658db]',
        icon: <Zap className="w-3 h-3 mr-1" /> 
      }
    default:
      return { 
        label: 'All Levels', 
        gradient: 'from-[#6b7280] to-[#4b5563]',
        icon: <Sparkles className="w-3 h-3 mr-1" /> 
      }
  }
}

export function ResourceCard({ resource, index }: ResourceCardProps) {
  const ResourceTypeIcon = getResourceTypeIcon(resource.resourceType)
  const typeGradient = getResourceTypeGradient(resource.resourceType)
  const experience = getExperienceLevel(resource.experienceLevel || 'all')
  
  // Animation delay based on index
  const animationDelay = index * 0.05
  
  return (
    <motion.div
      className="relative bg-white/5 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 h-full 
               transition-all duration-500 hover:border-white/20 hover:shadow-xl hover:shadow-[#473DC6]/10 group"
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden="true">
        <div className={`absolute -inset-1 bg-gradient-to-r ${typeGradient} opacity-10 blur-xl`}></div>
      </div>
      
      {/* Circuit pattern overlay */}
      <div className="absolute inset-0  bg-no-repeat bg-cover opacity-[0.03] mix-blend-overlay" aria-hidden="true"></div>
      
      {/* Subtle animated shimmer effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-30 animate-shimmer-slow group-hover:animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
      
      <div className="p-6 flex flex-col h-full relative z-10">
        {/* Resource Type Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r ${typeGradient} text-white shadow-sm`}>
            <div className="mr-1.5">
              <ResourceTypeIcon className="w-3 h-3" />
            </div>
            {formatResourceType(resource.resourceType)}
          </div>
          
          {/* Experience Level */}
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/10 text-white shadow-sm`}>
            {experience.icon}
            {experience.label}
          </div>
        </div>
        
        {/* Title with hover effect */}
        <h3 className={`${typography.heading} text-white group-hover:text-[#cfe6ff] transition-colors mb-2 line-clamp-2`}>
          {resource.title}
        </h3>
        
        {/* Description */}
        <p className={`${typography.body} text-white/70 mb-4 line-clamp-3`}>
          {resource.description}
        </p>
        
        {/* Topics Tags */}
        {resource.topics && resource.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.topics.map(topic => (
              <span 
                key={topic}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
              >
                {topic.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}
        
        {/* Metadata and Link */}
        <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center mr-2">
              <Clock className="w-3.5 h-3.5 text-white/60" />
            </div>
            <span className="text-xs uppercase text-white/60">{resource.estimatedTime}</span>
          </div>
          
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-110 group/btn"
            aria-label={`View ${resource.title}`}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-30 animate-shimmer-slow opacity-0 group-hover/btn:opacity-100"></span>
            <ExternalLink className="w-4 h-4 relative z-10 group-hover/btn:text-[#cfe6ff] transition-colors" />
          </a>
        </div>
      </div>
      
      {/* Floating particles for visual interest */}
      <div className="absolute top-1/4 right-4 w-1.5 h-1.5 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 animate-float-slow transition-opacity" aria-hidden="true"></div>
      <div className="absolute bottom-1/3 left-6 w-1 h-1 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 animate-float transition-opacity delay-150" aria-hidden="true"></div>
    </motion.div>
  )
}