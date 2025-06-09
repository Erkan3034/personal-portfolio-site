import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const skills = [
    { name: 'React', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'Node.js', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'SQL', level: 85 },
    { name: 'Git', level: 80 },
  ];

  const experiences = [
    {
      title: 'Senior Frontend Developer',
      company: 'Tech Company',
      period: '2022 - Günümüz',
      description: 'React ve modern web teknolojileri ile kullanıcı dostu uygulamalar geliştiriyorum.',
    },
    {
      title: 'Full Stack Developer',
      company: 'Startup',
      period: '2020 - 2022',
      description: 'End-to-end web uygulamaları geliştirdim ve veritabanı yönetimi yaptım.',
    },
    {
      title: 'Junior Developer',
      company: 'Digital Agency',
      period: '2018 - 2020',
      description: 'Frontend geliştirme ve UI/UX tasarım konularında deneyim kazandım.',
    },
  ];

  const education = [
    {
      degree: 'Bilgisayar Mühendisliği',
      school: 'İstanbul Teknik Üniversitesi',
      period: '2014 - 2018',
    },
    {
      degree: 'Web Geliştirme Sertifikası',
      school: 'Udemy',
      period: '2019',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Hakkımda
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Yazılım geliştirme tutkum ve sürekli öğrenme isteğimle, 
            modern web teknolojilerinde uzmanlaşmış bir geliştiriciyim.
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Hikayem</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-4">
                Yazılımla ilk tanışmam üniversite yıllarımda oldu. İlk "Hello World" 
                programımı yazdığımda, bilgisayarın benim komutlarımı anlayıp 
                çalıştırması beni büyüledi. O günden beri sürekli öğrenmeye ve 
                gelişmeye odaklandım.
              </p>
              <p className="mb-4">
                Frontend geliştirme konusunda uzmanlaştım ve React ekosisteminde 
                derinlemesine bilgi sahibi oldum. Kullanıcı deneyimini ön planda 
                tutarak, performanslı ve erişilebilir web uygulamaları geliştiriyorum.
              </p>
              <p>
                Her projede en iyi pratikleri uygulayarak, sürdürülebilir ve 
                ölçeklenebilir kod yazmaya özen gösteriyorum. Sürekli öğrenme 
                tutkum sayesinde yeni teknolojileri hızlıca öğrenip projelerime 
                entegre edebiliyorum.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Yeteneklerim</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className="text-sm text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Deneyim</h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="border-l-4 border-primary pl-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {exp.title}
                  </h3>
                  <p className="text-primary font-medium mb-2">{exp.company}</p>
                  <p className="text-gray-500 text-sm mb-3">{exp.period}</p>
                  <p className="text-gray-600">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Eğitim</h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {edu.degree}
                    </h3>
                    <p className="text-gray-600">{edu.school}</p>
                  </div>
                  <span className="text-primary font-medium mt-2 md:mt-0">
                    {edu.period}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Goals Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Hedeflerim</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Kısa Vadeli</h3>
                <ul className="space-y-2">
                  <li>• Yeni teknolojiler öğrenmek</li>
                  <li>• Açık kaynak projelere katkıda bulunmak</li>
                  <li>• Daha fazla proje geliştirmek</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Uzun Vadeli</h3>
                <ul className="space-y-2">
                  <li>• Kendi yazılım şirketimi kurmak</li>
                  <li>• Mentorluk yapmak</li>
                  <li>• Teknoloji topluluğuna katkı sağlamak</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 