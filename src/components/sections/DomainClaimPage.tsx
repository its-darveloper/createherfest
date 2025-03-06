'use client';

import { useState, useEffect } from 'react';
import DomainSearch from '@/components/domain/DomainSearch';
import DomainCart from '@/components/domain/DomainCart';
import DomainCheckout from '@/components/domain/DomainCheckout';
import { useCart } from '@/app/context/CartContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Lock, 
  MessageCircle, 
  Users,
  Rocket,
  ArrowDown,
  ExternalLink,
  PieChart,
  Award,
  Sparkles,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function DomainClaimPage() {
  const [activeTab, setActiveTab] = useState('search');
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;

  const campaignSteps = [
    {
      icon: <MessageCircle className="w-8 h-8 text-[#cfe6ff]" />,
      title: 'Tell Your .HER Story',
      description: 'Share why you chose your domain and what it means to you. Express yourself through writing, visuals, or video.'
    },
    {
      icon: <Users className="w-8 h-8 text-[#cfe6ff]" />,
      title: 'Post on Social Media',
      description: 'Share on X, Instagram, LinkedIn or Discord with #HERdomain and tag @UnstoppableWeb & @CreateHERFest'
    },
    {
      icon: <Award className="w-8 h-8 text-[#cfe6ff]" />,
      title: 'Win Premium Domains & Rewards',
      description: 'Top entries will be showcased and community voting will determine winners of premium domains and Web3 incentives'
    }
  ];

  const benefits = [
    {
      icon: Rocket,
      title: 'OWN IT FOR LIFE',
      description: 'No renewal fees. No middlemen. Just full ownership, forever.'
    },
    {
      icon: MessageCircle,
      title: 'SECURE COMMUNICATION',
      description: 'Connect with mentors, collaborators, and industry leaders through encrypted messaging.'
    },
    {
      icon: Lock,
      title: 'SEAMLESS TRANSACTIONS',
      description: 'Simplify crypto payments with a memorable domain instead of long wallet addresses.'
    },
    {
      icon: Heart,
      title: 'MAKE AN IMPACT',
      description: 'A portion of every .HER domain claim supports our mission to empower women in tech.'
    }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#150e60] via-[#1b1263] to-[#201574] pb-20">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[#150e60] opacity-50"></div>
          <div className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full bg-[#caa3d6] filter blur-[80px] animate-pulse"></div>
          <div className="absolute bottom-[20%] left-[10%] w-72 h-72 rounded-full bg-[#473dc6] filter blur-[100px] animate-pulse delay-700"></div>
          <div className="absolute top-[40%] left-[30%] w-56 h-56 rounded-full bg-[#cfe6ff] filter blur-[90px] animate-pulse delay-1000"></div>
        </div>
        
        {/* Fixed: Added more padding and adjusted line heights */}
        <div className="container max-w-7xl mx-auto px-4 pt-20 sm:pt-28 pb-20 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Fixed: Adjusted text classes for better spacing, added padding */}
            <h1 className="font-urbanist text-title-lg md:text-[4.5rem] lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.1] animate-text-shimmer text-transparent bg-clip-text bg-gradient-to-r from-[#cfe6ff] via-[#f1eae7] to-[#caa3d6] py-4 my-6">
              INTRODUCING <span className="text-[#cfe6ff]">.HER</span>
            </h1>
            <p className="font-inter text-section-lg md:text-section-xl max-w-2xl mx-auto text-white/90 leading-relaxed mb-12">
              A Domain for Innovation, Ownership & Impact
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="btn-shimmer bg-[#473dc6] hover:bg-[#d9bee2] text-white py-3 px-8 rounded-lg text-lg font-medium shadow-glow hover:shadow-glow-hover transition-all duration-300"
                onClick={() => document.querySelector('.domain-search-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                CLAIM YOUR .HER DOMAIN NOW
              </Button>
              <Button 
                className="btn-shimmer bg-transparent border-2 border-[#cfe6ff] hover:bg-[#cfe6ff]/10 text-white py-3 px-8 rounded-lg text-lg font-medium shadow-glow hover:shadow-glow-hover transition-all duration-300"
                onClick={() => document.querySelector('.benefits-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                LEARN MORE <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 pt-8 z-10 relative">
        {/* Domain Search Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="domain-search-section max-w-5xl mx-auto mt-8 relative z-10"
        >
          <div className="shimmer-container bg-[#150e60]/90 p-6 sm:p-8 rounded-2xl border border-[#473dc6]/40 shadow-glow">
            <Tabs 
              defaultValue="search" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="flex flex-col"
            >
              <TabsList className="grid grid-cols-3 bg-[#0d0840] p-1 rounded-lg gap-1 mb-6">
                <TabsTrigger 
                  value="search"
                  className="data-[state=active]:bg-[#473dc6] data-[state=active]:text-white rounded-md py-3 transition-all text-white/80 data-[state=active]:shadow-md font-urbanist"
                >
                  Search
                </TabsTrigger>
                <TabsTrigger 
                  value="cart"
                  className="data-[state=active]:bg-[#473dc6] data-[state=active]:text-white rounded-md py-3 transition-all text-white/80 data-[state=active]:shadow-md relative font-urbanist"
                  disabled={items.length === 0}
                >
                  Cart
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#caa3d6] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="checkout"
                  className="data-[state=active]:bg-[#473dc6] data-[state=active]:text-white rounded-md py-3 transition-all text-white/80 data-[state=active]:shadow-md font-urbanist"
                  disabled={activeTab !== 'checkout'}
                >
                  Checkout
                </TabsTrigger>
              </TabsList>
              
              <div>
                <TabsContent value="search" className="mt-0">
                  {/* Removed auto-redirect to cart */}
                  <DomainSearch onAddToCart={() => {}} />
                </TabsContent>
                
                <TabsContent value="cart" className="mt-0">
                  <DomainCart onProceedToCheckout={() => setActiveTab('checkout')} />
                </TabsContent>
                
                <TabsContent value="checkout" className="mt-0">
                  <DomainCheckout onSuccess={() => setActiveTab('search')} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          {/* Floating cart button visible when items in cart but viewing search tab */}
          {items.length > 0 && activeTab === 'search' && (
            <div className="fixed bottom-8 right-8 z-50">
              <Button
                onClick={() => setActiveTab('cart')}
                className="bg-[#473dc6] hover:bg-[#5c51e6] text-white rounded-full p-4 shadow-lg flex items-center"
              >
                <ShoppingCart className="h-6 w-6 mr-2" />
                View Cart ({items.length})
              </Button>
            </div>
          )}
          
          {/* Benefits Section */}
          {activeTab === 'search' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="benefits-section mt-24"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-2">Why Choose <span className="text-[#cfe6ff]">.HER</span>?</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#caa3d6] to-[#473dc6] mx-auto rounded-full mb-2"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="shimmer-container bg-[#150e60]/90 p-6 rounded-xl border border-[#473dc6]/40 hover:border-[#caa3d6]/70 transition-all duration-300 shadow-glow group"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#473dc6]/30 flex items-center justify-center mb-4 group-hover:bg-[#473dc6]/50 transition-all">
                      <benefit.icon className="w-7 h-7 text-[#cfe6ff]" />
                    </div>
                    <h3 className="font-urbanist font-bold text-lg text-[#cfe6ff] mb-2">{benefit.title}</h3>
                    <p className="text-white/80 font-inter">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
              
              {/* Campaign Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-32 text-center"
              >
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-2">The <span className="text-[#caa3d6]">#HERdomain</span> Campaign</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-[#caa3d6] to-[#473dc6] mx-auto rounded-full mb-4"></div>
                  <p className="text-white/80 max-w-2xl mx-auto">
                    We want to know why you claimed your .HER domain and what it represents for you. 
                    Share your story and win exclusive rewards!
                  </p>
                </div>
                
                <div className="bg-[#150e60]/80 p-8 rounded-2xl border border-[#473dc6]/40 mb-12">
                  <h3 className="text-2xl font-semibold text-[#cfe6ff] mb-6">How to Participate</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {campaignSteps.map((step, index) => (
                      <div key={index} className="relative">
                        {index < campaignSteps.length - 1 && (
                          <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-[#473dc6]/60"></div>
                        )}
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-[#473dc6]/30 flex items-center justify-center mb-4">
                            {step.icon}
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                          <p className="text-white/70">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => setShowCampaignModal(true)}
                    className="mt-8 bg-[#473dc6] hover:bg-[#d9bee2] text-white py-3 px-8 rounded-lg text-lg font-medium shadow-glow hover:shadow-glow-hover transition-all duration-300"
                  >
                    Learn More About The Campaign <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
              
              {/* Why This Matters Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-24 text-center bg-[#150e60]/70 p-12 rounded-xl border border-[#473dc6]/40"
              >
                <h2 className="text-3xl font-bold text-white mb-2">Why This Matters</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#caa3d6] to-[#473dc6] mx-auto rounded-full mb-6"></div>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                  <div className="w-full md:w-1/2 text-left">
                    <h3 className="text-2xl font-bold text-[#cfe6ff] mb-4">CLOSING THE GAP</h3>
                    <p className="text-white/80 leading-relaxed mb-6">
                      Women currently represent only 10-25% of the workforce in the crypto industry. 
                      .HER domains are more than digital identities—they're a commitment to changing these statistics 
                      by funding education, creating opportunities, and establishing visible representation onchain.
                    </p>
                    
                    <p className="text-white/80 leading-relaxed">
                      The #HERdomain campaign celebrates women's impact in Web3 & tech throughout 
                      Women's History Month and beyond by amplifying real stories from female builders, 
                      creators and innovators.
                    </p>
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    <div className="bg-[#1d1b6d] p-6 rounded-xl border border-[#473dc6]/40">
                      <div className="flex justify-between mb-6">
                        <div>
                          <h4 className="text-[#cfe6ff] font-medium">Current representation</h4>
                          <p className="text-3xl font-bold text-white">10-25%</p>
                          <p className="text-xs text-white/60">Women in crypto industry</p>
                        </div>
                        <PieChart className="h-16 w-16 text-[#caa3d6]" />
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-white/70">AI & ML</span>
                          <span className="text-xs text-white/70">20%</span>
                        </div>
                        <div className="w-full bg-[#0d0840] rounded-full h-2">
                          <div className="bg-[#caa3d6] h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-white/70">Blockchain</span>
                          <span className="text-xs text-white/70">12%</span>
                        </div>
                        <div className="w-full bg-[#0d0840] rounded-full h-2">
                          <div className="bg-[#caa3d6] h-2 rounded-full" style={{ width: '12%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-white/70">AR/VR</span>
                          <span className="text-xs text-white/70">14%</span>
                        </div>
                        <div className="w-full bg-[#0d0840] rounded-full h-2">
                          <div className="bg-[#caa3d6] h-2 rounded-full" style={{ width: '14%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* CTA Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="mt-24 text-center"
              >
                <h2 className="text-3xl font-bold text-white mb-6">OWN YOUR SPACE IN WEB3</h2>
                <p className="text-white/80 max-w-2xl mx-auto mb-8">
                  March is Women's History Month—make your mark onchain. Be part of a future built on inclusivity, 
                  innovation, and self-sovereignty. Join us in owning HER domains, making HER impact, 
                  and building HER future. It starts with your story.
                </p>
                
                <Button 
                  className="btn-shimmer bg-[#473dc6] hover:bg-[#d9bee2] text-white py-3 px-8 rounded-lg text-lg font-medium shadow-glow hover:shadow-glow-hover transition-all duration-300"
                  onClick={() => document.querySelector('.domain-search-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  CLAIM YOUR .HER DOMAIN
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#150e60] p-8 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto border border-[#473dc6] relative"
          >
            <button 
              onClick={() => setShowCampaignModal(false)} 
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-3xl font-bold text-[#cfe6ff] mb-4">#HERdomain Campaign</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-[#caa3d6] to-[#473dc6] rounded-full mb-6"></div>
            
            <h4 className="text-xl font-semibold text-white mb-3">What Does Your .HER Domain Mean to You?</h4>
            <p className="text-white/80 mb-6">
              We want to know why you claimed your .HER domain and what it represents for you. Is it your personal brand in the decentralized world? A dedication to a woman who inspires you? The start of a groundbreaking Web3 project?
            </p>
            <p className="text-white/80 mb-6">
              Share your #HERdomain story using text, images, or video. Get creative with AI art, memes, and short clips. The most compelling stories will be featured on our site and voted on by the community to win exclusive rewards.
            </p>
            
            <h4 className="text-xl font-semibold text-white mb-3">How to Participate</h4>
            <ol className="list-decimal list-inside text-white/80 mb-6 pl-4 space-y-4">
              <li className="pl-2">
                <span className="font-bold text-[#caa3d6]">Tell Your .HER Story</span>
                <ul className="list-disc list-inside ml-6 mt-2 text-white/70">
                  <li>Share why you chose your domain and what it means to you</li>
                  <li>Express yourself through writing, visuals, or video</li>
                </ul>
              </li>
              <li className="pl-2">
                <span className="font-bold text-[#caa3d6]">Post on Social Media</span>
                <ul className="list-disc list-inside ml-6 mt-2 text-white/70">
                  <li>Share your story on X, Instagram, LinkedIn or Discord</li>
                  <li>Include the #HERdomain hashtag and tag @UnstoppableWeb & @CreateHERFest</li>
                </ul>
              </li>
              <li className="pl-2">
                <span className="font-bold text-[#caa3d6]">Win Premium Domains & Rewards</span>
                <ul className="list-disc list-inside ml-6 mt-2 text-white/70">
                  <li>Top entries will be showcased on our website</li>
                  <li>Community voting will determine the winners</li>
                  <li>Prizes include premium .HER domains and bonus Web3 incentives</li>
                </ul>
              </li>
            </ol>
            
            <h4 className="text-xl font-semibold text-white mb-3">Ongoing Engagement & Rewards</h4>
            <p className="text-white/80 mb-6">
              Each month, we'll spotlight the best #HERdomain stories on our site. The top three entries, selected by community vote, will receive exclusive .HER domains and other Web3 rewards.
            </p>
            <p className="text-white/80 mb-6">
              It's an opportunity to have your voice heard, connect with like-minded women, and make your mark on the decentralized web. Your .HER domain is your space to own.
            </p>
            
            <div className="flex justify-center mt-8">
              <Button 
                onClick={() => setShowCampaignModal(false)}
                className="bg-[#473dc6] hover:bg-[#d9bee2] text-white px-6 py-3 rounded-lg"
              >
                Got it! Ready to participate
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}