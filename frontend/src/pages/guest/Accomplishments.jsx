import React from 'react';
import { Award, Star, Trophy, Medal, GraduationCap, BookOpen, Users, Calendar } from 'lucide-react';
import { asset } from '../../assets/asset';

const Accomplishments = () => {
const achievements = [
    {
      id: 1,
      title: "Summa Cum Laude Graduate",
      description: "Graduated with highest honors, maintaining a 3.9 GPA throughout the academic program. This achievement represents four years of dedicated study, countless hours in the library, and a commitment to academic excellence that culminated in being recognized among the top 5% of graduates.",
      date: "May 2024",
      category: "Academic Excellence",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "bg-blue-500",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      imageAlt: "Graduation ceremony with cap and diploma"
    },
    {
      id: 2,
      title: "Dean's List Recognition",
      description: "Consistently achieved Dean's List status for six consecutive semesters, demonstrating sustained academic excellence. This recognition required maintaining a GPA of 3.5 or higher while taking a full course load and participating in extracurricular activities.",
      date: "2022-2024",
      category: "Academic Achievement",
      icon: <Star className="w-6 h-6" />,
      color: "bg-purple-500",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      imageAlt: "Students studying in university library"
    },
    {
      id: 3,
      title: "National Merit Scholar",
      description: "Awarded full scholarship based on academic excellence and standardized test performance. This prestigious recognition opened doors to educational opportunities and provided financial support throughout my undergraduate studies, allowing me to focus entirely on academic pursuits.",
      date: "September 2020",
      category: "Scholarship",
      icon: <Award className="w-6 h-6" />,
      color: "bg-green-500",
      imageUrl: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      imageAlt: "Scholarship award ceremony"
    },
    {
      id: 4,
      title: "Research Excellence Award",
      description: "Recognized for outstanding undergraduate research in Computer Science and Innovation. Led a team of 4 students in developing an AI-powered educational platform that was later adopted by the university's tutoring center, impacting over 500 students annually.",
      date: "April 2024",
      category: "Research",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-orange-500",
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      imageAlt: "Research presentation and laboratory work"
    },
    {
      id: 5,
      title: "Student Government President",
      description: "Elected to lead student body, implementing three major campus improvement initiatives including a new mental health support program, sustainable dining options, and enhanced study spaces. Successfully managed a $50,000 budget and represented 12,000+ students.",
      date: "2023-2024",
      category: "Leadership",
      icon: <Users className="w-6 h-6" />,
      color: "bg-red-500",
      imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      imageAlt: "Student government meeting and leadership activities"
    },
    {
      id: 6,
      title: "Mathematics Olympiad Champion",
      description: "First place winner in the Regional Mathematics Competition for two consecutive years, competing against over 200 participants from 50+ schools. This achievement culminated years of problem-solving practice and mathematical exploration beyond the standard curriculum.",
      date: "2023-2024",
      category: "Competition",
      icon: <Trophy className="w-6 h-6" />,
      color: "bg-yellow-500",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      imageAlt: "Mathematics competition and award ceremony"
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">UCLMCARES Accomplishments</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive overview of uclmcares achievements, honors, and recognitions earned throughout my educational journey.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Accomplishments Gallery */}
        <div className="space-y-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Academic Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">A visual chronicle of academic milestones, achievements, and memorable moments throughout my educational experience</p>
          </div>

          <div className="space-y-8">
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className={`flex ${index % 2 === 0 ? 'flex-col lg:flex-row' : 'flex-col lg:flex-row-reverse'} bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300`}>
                {/* Image Section */}
                <div className="lg:w-1/2 relative">
                  <div className="h-80 lg:h-full relative overflow-hidden">
                    <img 
                      src={achievement.imageUrl} 
                      alt={achievement.imageAlt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold mb-1">{achievement.date}</div>
                          <div className="text-sm opacity-90 uppercase tracking-wide">{achievement.category}</div>
                        </div>
                        <div className={`p-3 rounded-full ${achievement.color} bg-opacity-20 backdrop-blur-sm`}>
                          {React.cloneElement(achievement.icon, { className: "w-6 h-6 text-white" })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full mb-4">
                      {achievement.category}
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {achievement.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Achieved in {achievement.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Summary */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white bg-opacity-20 rounded-full">
              <Trophy className="w-10 h-10" />
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-6">A Journey of Excellence</h3>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
            From academic recognition to leadership roles, each achievement represents a milestone in my commitment to learning, 
            growth, and making a positive impact in the academic community.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">2020-2024</div>
              <div className="text-blue-200">Academic Years</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">6+</div>
              <div className="text-blue-200">Major Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">Multiple</div>
              <div className="text-blue-200">Areas of Excellence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accomplishments;