// src/app/about/page.tsx
import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">About CreateHer Fest</h1>
      <p className="text-gray-700 leading-relaxed mb-6">
        This is a placeholder About Us page. You can replace this content with real information about CreateHer Fest.
        For example, you might want to include details about the events mission, history, organizers, and values.
      </p>
      <p className="text-gray-700 leading-relaxed mb-6">
        Feel free to customize this page with your own text, images, and components.
        This dummy content is just to ensure your Next.js application compiles and deploys correctly.
      </p>
      <p className="text-sm text-gray-500 text-center">
        (Dummy Content - Replace with actual About Us information)
      </p>
    </div>
  );
};

export default AboutPage;