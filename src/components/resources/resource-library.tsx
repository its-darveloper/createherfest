"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, BookOpen, Video, Laptop, Code, FileText, Filter, Sparkles, Zap, BookMarked, ChevronDown, ArrowRight } from 'lucide-react'
import { typography } from '@/lib/utils/typography'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Resource } from '@/types/sanity'
import { ResourceCard } from './resource-card'

interface ResourceLibraryProps {
  initialResources: Resource[]
}

// Helper function to import all the icons
import { 
  Shield, Database, Network, Presentation, 
  Star, Link, Users, Calendar 
} from 'lucide-react'

// Define our filter categories
const TOPICS = [
    { id: 'ai_ml', name: 'AI/ML', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'cyber_security', name: 'Cyber Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'data_in_tech', name: 'Data in Tech', icon: <Database className="w-4 h-4" /> },
    { id: 'data_structures', name: 'Data Structures', icon: <Network className="w-4 h-4" /> },
    { id: 'algorithms', name: 'Algorithms', icon: <Code className="w-4 h-4" /> },
    { id: 'for_educators', name: 'For Educators', icon: <Presentation className="w-4 h-4" /> },
    { id: 'branding_story', name: 'Branding Story', icon: <Star className="w-4 h-4" /> },
    { id: 'ar_vr', name: 'AR/VR', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'blockchain', name: 'Blockchain', icon: <Link className="w-4 h-4" /> },
    { id: 'cross_team_collaboration', name: 'Cross-team Collaboration', icon: <Users className="w-4 h-4" /> },
    { id: 'project_planning', name: 'Project Planning', icon: <Calendar className="w-4 h-4" /> }
  ]

const CONTENT_TYPES = [
  { id: 'video', name: 'Video', icon: Video },
  { id: 'online_course', name: 'Online Course', icon: Laptop },
  { id: 'reading', name: 'Reading', icon: BookOpen },
  { id: 'interactive_tutorial', name: 'Interactive Tutorial', icon: Code },
  { id: 'coding_question', name: 'Coding Question', icon: FileText },
  { id: 'quiz', name: 'Quiz', icon: BookMarked }
]

const PROGRAMMING_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: <Code className="w-4 h-4" /> },
  { id: 'python', name: 'Python', icon: <Code className="w-4 h-4" /> },
  { id: 'java', name: 'Java', icon: <Code className="w-4 h-4" /> },
  { id: 'cpp', name: 'C++', icon: <Code className="w-4 h-4" /> }
]

export function ResourceLibrary({ initialResources }: ResourceLibraryProps) {
  const [resources] = useState<Resource[]>(initialResources)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300) // 300ms debounce
    
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  // Filter resources based on selected criteria
  const filteredResources = resources.filter(resource => {
    // Filter by search query
    if (debouncedSearch && !resource.title.toLowerCase().includes(debouncedSearch.toLowerCase()) && 
        !resource.description.toLowerCase().includes(debouncedSearch.toLowerCase())) {
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
    setDebouncedSearch('')
    setSelectedTopics([])
    setSelectedTypes([])
    setSelectedLanguages([])
  }
  
  return (
    <div className="container mx-auto px-4">
      {/* Hero section with enhanced glassmorphism */}
      <motion.div 
        className="relative rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl shadow-xl mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background gradients */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-[#473DC6]/80 to-[#150E60]/95"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#caa3d6]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#473dc6]/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 border border-[#473dc6]/20 rounded-full animate-spin-slow opacity-30"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-10 md:p-20 max-w-4xl mx-auto">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-[#cfe6ff] to-[#473DC6] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#473DC6]/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-white via-[#cfe6ff] to-[#caa3d6] bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Resource Library
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white/90 text-center mb-10 max-w-3xl mx-auto leading-relaxed shadow-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Below, you&apos;ll find a curated collection of resources designed to help you thrive in tech.
            This is your space to read, listen, grow, and spread knowledge. Dive in and take your
            skills to the next level!
          </motion.p>
          
          {/* Search input */}
          <motion.div
            className="max-w-2xl mx-auto relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-focus-within:bg-white/20 transition-colors">
                <Search className="text-white/70 w-4 h-4" />
              </div>
              <Input
                type="text"
                placeholder="Search for resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 pr-12 py-7 bg-white/10 hover:bg-white/[0.15] focus:bg-white/[0.15] border-white/10 focus:border-white/20 text-white placeholder:text-white/50 rounded-xl shadow-inner transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Mobile filter toggle */}
            <div className="md:hidden mt-4 flex justify-center">
              <Button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full px-4 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar filters */}
        <AnimatePresence>
          {(isMobileFiltersOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
            <motion.div 
              className="lg:col-span-1 order-2 lg:order-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 lg:sticky lg:top-24 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                {/* Subtle background design elements */}
                <div className="absolute inset-0 z-0" aria-hidden="true">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#473dc6]/10 to-transparent rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#caa3d6]/10 to-transparent rounded-full blur-2xl"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#473dc6] to-[#6658db] flex items-center justify-center shadow-lg">
                        <Filter className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">Filters</h2>
                    </div>
                    
                    {(selectedTopics.length > 0 || selectedTypes.length > 0 || selectedLanguages.length > 0 || searchQuery) && (
                      <button
                        onClick={clearFilters}
                        className="text-[#cfe6ff] hover:text-white text-sm transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Clear all
                      </button>
                    )}
                  </div>
                  
                  {/* Topics filter */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-[#caa3d6]" />
                      Topics
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {TOPICS.map(topic => (
                        <label key={topic.id} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedTopics.includes(topic.id)}
                            onChange={() => toggleTopic(topic.id)}
                            className="sr-only"
                          />
                          <span 
                            className={`w-5 h-5 rounded border mr-3 flex-shrink-0 transition-colors flex items-center justify-center
                                    ${selectedTopics.includes(topic.id) 
                                      ? 'bg-[#473DC6] border-[#473DC6]' 
                                      : 'bg-white/5 border-white/20 group-hover:border-white/40'}`}
                          >
                            {selectedTopics.includes(topic.id) && (
                              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                              </svg>
                            )}
                          </span>
                          <span className="text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
                            <span className="opacity-70">{topic.icon}</span>
                            {topic.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Content Type filter */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <Laptop className="w-4 h-4 mr-2 text-[#caa3d6]" />
                      Content Type
                    </h3>
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
                            className={`w-5 h-5 rounded border mr-3 flex-shrink-0 transition-colors flex items-center justify-center
                                    ${selectedTypes.includes(type.id) 
                                      ? 'bg-[#473DC6] border-[#473DC6]' 
                                      : 'bg-white/5 border-white/20 group-hover:border-white/40'}`}
                          >
                            {selectedTypes.includes(type.id) && (
                              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                              </svg>
                            )}
                          </span>
                          <span className="text-white/80 group-hover:text-white transition-colors flex items-center">
                            <type.icon className="w-4 h-4 mr-2 opacity-70" />
                            {type.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Programming Language filter */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                      <Code className="w-4 h-4 mr-2 text-[#caa3d6]" />
                      Programming Language
                    </h3>
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
                            className={`w-5 h-5 rounded border mr-3 flex-shrink-0 transition-colors flex items-center justify-center
                                    ${selectedLanguages.includes(language.id) 
                                      ? 'bg-[#473DC6] border-[#473DC6]' 
                                      : 'bg-white/5 border-white/20 group-hover:border-white/40'}`}
                          >
                            {selectedLanguages.includes(language.id) && (
                              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                              </svg>
                            )}
                          </span>
                          <span className="text-white/80 group-hover:text-white transition-colors flex items-center gap-2">
                            {language.icon}
                            {language.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Resources grid */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {/* Active filters with glassmorphism styling */}
          {(selectedTopics.length > 0 || selectedTypes.length > 0 || selectedLanguages.length > 0) && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <div className="flex flex-wrap gap-2">
                  {selectedTopics.map(topicId => {
                    const topic = TOPICS.find(t => t.id === topicId)
                    return topic ? (
                      <div
                        key={topicId}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full pl-2 pr-1 py-1
                                flex items-center gap-1 group hover:bg-white/10 transition-colors duration-200"
                      >
                        <div className="w-5 h-5 rounded-full bg-[#473dc6]/30 flex items-center justify-center mr-1">
                          {topic.icon}
                        </div>
                        <span className="text-xs text-white">{topic.name}</span>
                        <button
                          onClick={() => toggleTopic(topicId)}
                          className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
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
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full pl-2 pr-1 py-1
                                flex items-center gap-1 group hover:bg-white/10 transition-colors duration-200"
                      >
                        <type.icon className="w-4 h-4 text-[#caa3d6] mr-1" />
                        <span className="text-xs text-white">{type.name}</span>
                        <button
                          onClick={() => toggleContentType(typeId)}
                          className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
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
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full pl-2 pr-1 py-1
                                flex items-center gap-1 group hover:bg-white/10 transition-colors duration-200"
                      >
                        {language.icon}
                        <span className="text-xs text-white ml-1">{language.name}</span>
                        <button
                          onClick={() => toggleLanguage(languageId)}
                          className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10"
                          aria-label={`Remove ${language.name} filter`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Results count with glassmorphism styling */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white/60">
              <Sparkles className="w-4 h-4 mr-2 text-[#caa3d6]" />
              Showing <span className="text-white font-medium mx-1">{filteredResources.length}</span> of <span className="text-white font-medium mx-1">{resources.length}</span> resources
            </div>
          </motion.div>
          
          {/* Resources grid with staggered animation */}
          {filteredResources.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {filteredResources.map((resource, index) => (
                <ResourceCard key={resource._id} resource={resource} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-[#caa3d6]" />
              </div>
              
              <h3 className="text-2xl font-semibold text-white mb-4">No resources found</h3>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Try adjusting your search criteria or clearing some filters to discover more resources.
              </p>
              <Button
                onClick={clearFilters}
                className="relative overflow-hidden bg-gradient-to-r from-[#473DC6] to-[#6658db] hover:from-[#5549d5] hover:to-[#7668eb] text-white rounded-full px-6 py-3 transition-all duration-300 group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-30 animate-shimmer"></span>
                <span className="relative flex items-center gap-2">
                  Clear all filters
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          )}
          
          {/* Load more button if needed */}
          {filteredResources.length > 0 && filteredResources.length < resources.length && (
            <div className="mt-12 text-center">
              <Button 
                className="relative overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 text-white hover:border-white/20 rounded-full px-8 py-3 transition-all duration-300 group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-30 animate-shimmer-slow"></span>
                <span className="relative flex items-center gap-2">
                  Load More Resources
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}