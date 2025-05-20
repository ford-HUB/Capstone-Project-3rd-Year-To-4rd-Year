import React from 'react';

export default function UCLMCaresUI() {
  // Sample mission content
  const missionContent = [
    {
      title: "UCLM-Cares Mission & Goals",
      description: "UCLM Cares is committed to supporting communities through education, healthcare, and social welfare initiatives. Our programs focus on empowering individuals and improving lives."
    },
    {
      title: "Education Programs",
      description: "We provide educational resources, scholarships, and mentoring to underserved communities. Our aim is to bridge educational gaps and create opportunities for lifelong learning."
    },
    {
      title: "Healthcare Initiatives",
      description: "Our healthcare programs focus on preventive care, health education, and improving access to medical services in remote and underserved areas."
    },
    {
      title: "Social Welfare",
      description: "We develop community support systems that address basic needs, mental health, and social integration to foster more resilient communities."
    },
    {
      title: "Community Engagement",
      description: "Through partnerships with local organizations, we create sustainable solutions that address the unique challenges faced by different communities."
    },
    {
      title: "Research & Development",
      description: "We continuously evaluate our programs and research new approaches to solving social challenges, ensuring our initiatives remain effective and responsive to community needs."
    },
    {
      title: "Global Partnerships",
      description: "Our collaborative networks extend globally, allowing us to share knowledge, resources, and best practices across borders to maximize our collective impact."
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen pt-12 ">
      {/* Content container - no fixed height, allows full page scrolling */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
        {/* Logo watermark */}
        <div className="relative ">
          {/* Content sections with increased spacing */}
          <div className="relative z-10">
            {missionContent.map((section, index) => (
              <div 
                key={index} 
                className={`p-12 ${index > 0 ? 'border-t-60 border-gray-100 mt-24' : ''}`}
              >
                {index === 0 ? (
                  <div className="mb-16 pb-8 border-b border-gray-200">
                    <h1 className="text-4xl font-bold">
                      <span className="text-blue-600">UCLM-Cares</span>
                      <span className="text-black"> Mission & Goals</span>
                    </h1>
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold mb-8 text-blue-600">{section.title}</h2>
                )}
                <p className="text-lg text-gray-700 leading-relaxed">
                  {section.description}
                </p>
                
                {/* Bullet points */}
                {index > 0 && (
                  <div className="mt-8 pl-4">
                    <ul className="list-disc space-y-4 text-gray-700">
                      <li>Key initiative 1 for {section.title.toLowerCase()}</li>
                      <li>Key initiative 2 for {section.title.toLowerCase()}</li>
                      <li>Key initiative 3 for {section.title.toLowerCase()}</li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
            
            {/* Extra padding at bottom */}
            <div className="h-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}