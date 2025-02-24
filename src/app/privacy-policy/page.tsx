"use client"

import { motion } from 'framer-motion'
import { Shield, Mail, Lock, Database } from 'lucide-react'
import { typography } from '@/lib/utils/typography'

interface FloatingElementProps {
  shape: string
  size: string
  position: string
  color: string
  delay?: number
  duration?: number
  scale?: number[]
}

function FloatingElement({ 
  shape, 
  size, 
  position, 
  color,
  delay = 0,
  duration = 20,
  scale = [0.8, 1.2]
}: FloatingElementProps) {
  return (
    <motion.div
      className={`absolute ${size} ${position} backdrop-blur-3xl rounded-3xl`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0.1, 0.3, 0.1],
        scale: scale,
        rotate: [0, 180],
        y: ['0%', '-20%', '0%']
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay
      }}
      style={{
        clipPath: shape,
        background: `linear-gradient(to bottom right, ${color}20, ${color}05)`
      }}
    />
  )
}

export default function PrivacyPolicyPage() {
  const policyHighlights = [
    {
      icon: Database,
      title: "Information We Collect",
      content: "We collect personal information and usage data to provide and improve our services, always prioritizing your privacy and security.",
      color: "text-[#37D5D6]",
      bgColor: "bg-[#37D5D6]/10"
    },
    {
      icon: Lock,
      title: "Data Security",
      content: "We implement robust security measures to protect your personal information, following GDPR requirements and industry best practices.",
      color: "text-[#4E6BFF]",
      bgColor: "bg-[#4E6BFF]/10"
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: "You have full control over your data, including the right to access, update, or delete your personal information at any time.",
      color: "text-[#CAA3D6]",
      bgColor: "bg-[#CAA3D6]/10"
    }
  ]

  return (
    <section className="relative w-full bg-[#150E60] overflow-hidden py-16 md:py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingElement
          shape="polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)"
          size="w-72 md:w-96 h-72 md:h-96"
          position="-top-20 -left-20"
          color="#37D5D6"
          delay={0}
        />
        <FloatingElement
          shape="circle(50% at 50% 50%)"
          size="w-40 md:w-48 h-40 md:h-48"
          position="bottom-1/4 right-1/4"
          color="#4E6BFF"
          delay={3}
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12 md:mb-20"
        >
          <div className="shimmer-container inline-block bg-[#473DC6]/20 px-4 py-2 rounded-full mb-6
                        border border-[#473DC6]/30 hover:border-white/20 transition-all duration-300">
            <span className={`${typography.caption} text-[#CAA3D6] uppercase tracking-widest`}>
              Privacy Policy
            </span>
          </div>
          <h1 className={`${typography.title} text-white mb-6 md:text-4xl sm:text-3xl`}>
            Protecting Your Privacy
          </h1>
          <p className={`${typography.section} text-white/80 max-w-3xl mx-auto`}>
            At CreateHER Fest, we value and respect your privacy. This policy outlines how we collect, 
            use, and protect your personal information.
          </p>
        </motion.div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12 md:mb-16 px-4">
          {policyHighlights.map((policy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`${policy.bgColor} border border-white/10 rounded-2xl p-6 md:p-8 
                         backdrop-blur-sm hover:bg-white/10 hover:border-white/20 
                         transition-all duration-300 transform hover:-translate-y-2
                         relative z-10`}
            >
              <div className={`mb-6 ${policy.color} w-12 md:w-16 h-12 md:h-16 p-3 md:p-4 rounded-full 
                              flex items-center justify-center bg-white/10`}>
                <policy.icon 
                  className="w-6 md:w-8 h-6 md:h-8" 
                  strokeWidth={1.5}
                />
              </div>
              <h3 className={`${typography.subheading} text-white mb-4`}>
                {policy.title}
              </h3>
              <p className={`${typography.body} text-white/70`}>
                {policy.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Information Collection Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/10"
            >
              <h2 className={`${typography.heading} text-white mb-6`}>Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`${typography.subheading} text-white mb-2`}>Personal Information</h3>
                  <p className={`${typography.body} text-white/70`}>
                    We may collect personal information such as your name, email address, and contact details when you 
                    register for our events, subscribe to our newsletters, or engage in community activities.
                  </p>
                </div>
                <div>
                  <h3 className={`${typography.subheading} text-white mb-2`}>Usage Data</h3>
                  <p className={`${typography.body} text-white/70`}>
                    We collect data on how you interact with our website or event platforms, such as pages visited, 
                    links clicked, and the duration of participation.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Data Sharing Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-white/10"
            >
              <h2 className={`${typography.heading} text-white mb-6`}>Data Sharing and Disclosure</h2>
              <p className={`${typography.body} text-white/70 mb-4`}>
                We will not sell or rent your personal information to third parties. However, we may share your 
                information with:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#473DC6]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#CAA3D6]" />
                  </div>
                  <p className={`${typography.body} text-white/70`}>
                    <strong className="text-white">Service Providers:</strong> To help us deliver services 
                    (e.g., payment processing, email marketing).
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#473DC6]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#CAA3D6]" />
                  </div>
                  <p className={`${typography.body} text-white/70`}>
                    <strong className="text-white">Sponsors and Partners:</strong> With your consent, we may share 
                    your information with sponsors who provide resources or opportunities related to the event.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#473DC6]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#CAA3D6]" />
                  </div>
                  <p className={`${typography.body} text-white/70`}>
                    <strong className="text-white">Legal Compliance:</strong> We may disclose your information if 
                    required by law or to protect the rights and safety of our community.
                  </p>
                </li>
              </ul>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-[#473DC6]/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-[#473DC6]/20"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#473DC6]/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#CAA3D6]" />
                </div>
                <div>
                  <h2 className={`${typography.heading} text-white mb-4`}>Contact Us</h2>
                  <p className={`${typography.body} text-white/70 mb-4`}>
                    For questions about this Privacy Policy or to exercise your rights regarding your data, 
                    please contact us at:
                  </p>
                  <a 
                    href="mailto:info@createherfest.com"
                    className="text-[#CAA3D6] hover:text-white transition-colors duration-300"
                  >
                    info@createherfest.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}