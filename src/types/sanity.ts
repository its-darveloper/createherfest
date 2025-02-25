// src/types/sanity.ts
export interface PortableTextBlock {
    _type: 'block';
    _key: string;
    children: {
      _key: string;
      _type: 'span';
      marks: string[];
      text: string;
    }[];
    markDefs: Array<{
      _key: string;
      _type: string;
    }>;
    style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';
  }
  
  export interface SanityImage {
    _type: 'image'
    asset: {
      _ref: string
      _type: 'reference'
    }
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
  }
  
  export interface FAQ {
    _id: string;
    _type: 'faq';
    question: string;
    answer: PortableTextBlock[];
    category: string;
    order: number;
  }
  
  export interface Workshop {
    _id: string;
    _type: 'workshop';
    title: string;
    description: string;
    date: string;
    duration: number;
    track: 'ai-ml' | 'blockchain' | 'ar-vr';
    speaker?: Speaker; // Speaker can be optional
    workshopUrl: string; // Required workshop URL
    recordingUrl?: string; // Optional recording URL
  }
  
  export interface Speaker {
    _id: string;
    _type: 'speaker';
    name: string;
    pronouns?: string;
    title?: string;
    company?: string;
    bio?: PortableTextBlock[];
    image?: SanityImage;
    linkedinUrl?: string;
    workshop?: { _ref: string; _type: 'reference' };
  }
  
  export interface Partner {
    _id: string;
    _type: 'partner';
    name: string;
    logo: SanityImage;
    website?: string;
    tier?: string;
  }

  export interface Mentor {
    _id: string;
    _type: 'mentor';
    name: string;
    headshot: SanityImage;
    bio: PortableTextBlock[];
    expertise: string[]; // Array of expertise strings
    tracks: string[];    // Array of track strings
    linkedinUrl?: string;
    title?: string;       // Add optional title field
    company?: string;
    availability: {
      _key: string; // Important to include _key for array items in Sanity
      startDate: string; // Or Date if you want to work with Date objects directly
      endDate: string;   // Or Date
      startTime: string; // Time as string "HH:mm"
      endTime: string;   // Time as string "HH:mm"
    }[];
    email?: string;
  }

  export interface Resource {
    _id: string;
    _type: 'resource';
    title: string;
    description: string;
    url: string;
    resourceType: 'video' | 'online_course' | 'reading' | 'interactive_tutorial' | 'coding_question' | 'quiz';
    topics?: Array<'ai_ml' | 'cyber_security' | 'data_in_tech' | 'data_structures' | 
                  'algorithms' | 'for_educators' | 'branding_story' | 'ar_vr' | 
                  'blockchain' | 'cross_team_collaboration' | 'project_planning'>;
    programmingLanguage?: 'javascript' | 'python' | 'java' | 'cpp' | 'na';
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    creator?: string;
  }