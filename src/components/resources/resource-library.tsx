"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X, BookOpen, Video, Laptop, Code, FileText } from 'lucide-react'
import { typography } from '@/lib/utils/typography'
import { Input } from '@/components/ui/input'
import type { Resource } from '@/types/sanity'
import { ResourceCard } from './resource-card'

interface ResourceLibraryProps {
  initialResources: Resource[]
}

// Define our filter categories
const TOPICS = [
    { id: 'ai_ml', name: 'AI/ML' },
    { id: 'cyber_security', name: 'Cyber Security' },
    { id: 'data_in_tech', name: 'Data in Tech' },
    { id: 'data_structures', name: 'Data Structures' },
    { id: 'algorithms', name: 'Algorithms' },
    { id: 'for_educators', name: 'For Educators' },
    { id: 'branding_story', name: 'Branding Story' },
    { id: 'ar_vr', name: 'AR/VR' },
    { id: 'blockchain', name: 'Blockchain' },
    { id: 'cross_team_collaboration', name: 'Cross-team Collaboration' },
    { id: 'project_planning', name: 'Project Planning' }
  ]

const CONTENT_TYPES = [
  { id: 'video', name: 'Video', icon: Video },
  { id: 'online_course', name: 'Online Course', icon: Laptop },
  { id: 'reading', name: 'Reading', icon: BookOpen },
  { id: 'interactive_tutorial', name: 'Interactive Tutorial', icon: Code },
  { id: 'coding_question', name: 'Coding Question', icon: FileText },
  { id: 'quiz', name: 'Quiz', icon: FileText }
]

const PROGRAMMING_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' }
]

export function ResourceLibrary({ initialResources }: ResourceLibraryProps) {
  const [resources] = useState<Resource[]>(initialResources)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  
  // Filter resources based on selected criteria
  const filteredResources = resources.filter(resource => {
    // Filter by search query
    if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !resource.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    // Filter by selected topics
    if (selectedTopics.length > 0 && 
        !(resource.topics?.some(topic => selectedTopics.includes(topic)) || false)) {
      return false
    }
    
    // Filter by selected resource types
    if (selectedTypes.length > 0 && !selectedTypes.includes(resource.resourceType)) {
      return false
    }
    
    // Filter by selected programming languages
    if (selectedLanguages.length > 0 && 
        resource.programmingLanguage && 
        !selectedLanguages.includes(resource.programmingLanguage)) {
      return false
    }
    
    return true
  })
  
  // Toggle topic selection
  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
    )
  }
  
  // Toggle content type selection
  const toggleContentType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]
    )
  }
  
  // Toggle programming language selection
  const toggleLanguage = (languageId: string) => {
    setSelectedLanguages(prev => 
      prev.includes(languageId) ? prev.filter(id => id !== languageId) : [...prev, languageId]
    )
  }
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTopics([])
    setSelectedTypes([])
    setSelectedLanguages([])
  }
  
  return (
    <div className="container mx-auto px-4">
      {/* Hero section */}
      <div className="rounded-3xl bg-gradient-to-r from-[#473DC6] to-[#150E60] p-10 md:p-16 mb-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-white/5 translate-x-1/2 translate-y-1/2"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.h1 
            className={`${typography.title} text-white mb-6 text-4xl`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Resource Library
          </motion.h1>
          
          <motion.p 
            className={`${typography.section} text-white/80 mb-8`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Below, you&apos;ll find a curated collection of resources designed to help you thrive in tech.
            This is your space to read, listen, grow, and spread knowledge. Dive in and take your
            skills to the next level!
          </motion.p>
          
          {/* Search input */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 bg-white/10 border-white/10 text-white placeholder:text-white/50 rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar filters */}
        <div className="lg:col-span-1">
          <div className="bg-[#1c144d] rounded-2xl border border-white/5 p-6 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`${typography.subheading} text-white`}>Filters</h2>
              {(selectedTopics.length > 0 || selectedTypes.length > 0 || selectedLanguages.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-[#CAA3D6] hover:text-white text-sm transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            
            {/* Topics filter */}
            <div className="mb-8">
              <h3 className={`${typography.body} font-medium text-white mb-3`}>Topics</h3>
              <div className="space-y-2">
                {TOPICS.map(topic => (
                  <label key={topic.id} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic.id)}
                      onChange={() => toggleTopic(topic.id)}
                      className="sr-only"
                    />
                    <span 
                      className={`w-4 h-4 rounded border mr-3 flex-shrink-0 transition-colors
                               ${selectedTopics.includes(topic.id) 
                                ? 'bg-[#473DC6] border-[#473DC6]' 
                                : 'border-white/30 group-hover:border-white/50'}`}
                    >
                      {selectedTopics.includes(topic.id) && (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      )}
                    </span>
                    <span className={`${typography.body} text-white/80 group-hover:text-white transition-colors`}>
                      {topic.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Content Type filter */}
            <div className="mb-8">
              <h3 className={`${typography.body} font-medium text-white mb-3`}>Content Type</h3>
              <div className="space-y-2">
                {CONTENT_TYPES.map(type => (
                  <label key={type.id} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.id)}
                      onChange={() => toggleContentType(type.id)}
                      className="sr-only"
                    />
                    <span 
                      className={`w-4 h-4 rounded border mr-3 flex-shrink-0 transition-colors
                               ${selectedTypes.includes(type.id) 
                                ? 'bg-[#473DC6] border-[#473DC6]' 
                                : 'border-white/30 group-hover:border-white/50'}`}
                    >
                      {selectedTypes.includes(type.id) && (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      )}
                    </span>
                    <span className={`${typography.body} text-white/80 group-hover:text-white transition-colors flex items-center`}>
                      <type.icon className="w-4 h-4 mr-2 opacity-70" />
                      {type.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Programming Language filter */}
            <div>
              <h3 className={`${typography.body} font-medium text-white mb-3`}>Programming Language</h3>
              <div className="space-y-2">
                {PROGRAMMING_LANGUAGES.map(language => (
                  <label key={language.id} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.includes(language.id)}
                      onChange={() => toggleLanguage(language.id)}
                      className="sr-only"
                    />
                    <span 
                      className={`w-4 h-4 rounded border mr-3 flex-shrink-0 transition-colors
                               ${selectedLanguages.includes(language.id) 
                                ? 'bg-[#473DC6] border-[#473DC6]' 
                                : 'border-white/30 group-hover:border-white/50'}`}
                    >
                      {selectedLanguages.includes(language.id) && (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      )}
                    </span>
                    <span className={`${typography.body} text-white/80 group-hover:text-white transition-colors`}>
                      {language.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Resources grid */}
        <div className="lg:col-span-3">
          {/* Active filters */}
          {(selectedTopics.length > 0 || selectedTypes.length > 0 || selectedLanguages.length > 0) && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {selectedTopics.map(topicId => {
                  const topic = TOPICS.find(t => t.id === topicId)
                  return topic ? (
                    <div
                      key={topicId}
                      className="bg-[#473DC6]/20 border border-[#473DC6]/30 rounded-full px-3 py-1
                               flex items-center gap-2"
                    >
                      <span className={`${typography.caption} text-white`}>{topic.name}</span>
                      <button
                        onClick={() => toggleTopic(topicId)}
                        className="text-white/70 hover:text-white"
                        aria-label={`Remove ${topic.name} filter`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null
                })}
                
                {selectedTypes.map(typeId => {
                  const type = CONTENT_TYPES.find(t => t.id === typeId)
                  return type ? (
                    <div
                      key={typeId}
                      className="bg-[#CAA3D6]/20 border border-[#CAA3D6]/30 rounded-full px-3 py-1
                               flex items-center gap-2"
                    >
                      <span className={`${typography.caption} text-white flex items-center`}>
                        <type.icon className="w-3 h-3 mr-1" />
                        {type.name}
                      </span>
                      <button
                        onClick={() => toggleContentType(typeId)}
                        className="text-white/70 hover:text-white"
                        aria-label={`Remove ${type.name} filter`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null
                })}
                
                {selectedLanguages.map(languageId => {
                  const language = PROGRAMMING_LANGUAGES.find(l => l.id === languageId)
                  return language ? (
                    <div
                      key={languageId}
                      className="bg-white/10 border border-white/20 rounded-full px-3 py-1
                               flex items-center gap-2"
                    >
                      <span className={`${typography.caption} text-white`}>{language.name}</span>
                      <button
                        onClick={() => toggleLanguage(languageId)}
                        className="text-white/70 hover:text-white"
                        aria-label={`Remove ${language.name} filter`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          )}
          
          {/* Results count */}
          <div className="mb-6">
            <p className={`${typography.body} text-white/60`}>
              Showing {filteredResources.length} of {resources.length} resources
            </p>
          </div>
          
          {/* Resources grid */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.map(resource => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="bg-[#1c144d] rounded-2xl border border-white/10 p-8 text-center">
              <h3 className={`${typography.heading} text-white mb-4`}>No resources found</h3>
              <p className={`${typography.body} text-white/70 mb-6`}>
                Try adjusting your search criteria or clearing some filters.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#473DC6] hover:bg-[#5246e5] text-white rounded-lg transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}