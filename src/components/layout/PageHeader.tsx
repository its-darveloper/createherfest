// components/layout/PageHeader.tsx

export default function PageHeader({ 
    title, 
    description 
  }: { 
    title: string; 
    description: string;
  }) {
    return (
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#150e60] mb-4">{title}</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#2b2b2b]">{description}</p>
      </div>
    );
  }