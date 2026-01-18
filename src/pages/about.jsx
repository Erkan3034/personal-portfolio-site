import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const skills = [
    'React', 'JavaScript', 'Python', 'SQL', 'Git', 'Java', 
    'C#', 'PHP', 'Unity', 'Node.js', 'HTML/CSS', 'TypeScript',
    'Django', 'Flask', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion'
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hakkımda
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Yazılım geliştirme tutkum ve sürekli öğrenme isteğimle, 
            modern web teknolojileri başta olmak üzere Full Stack  ve AI alanlarında kendimi geliştirmeye çalışıyorum.
          </p>
        </motion.div>

        {/* Download CV Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <a
            href="/cv.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-primary to-purple-400 hover:from-purple-500 hover:to-primary transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Download CV
          </a>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Hikayem</h2>
            <div className="prose prose-lg max-w-none text-gray-300">
              <p className="mb-4">
                Yazılım geliştirme serüvenim üniversite yıllarımda başladı ve o günden beri Python, Java ve web teknolojileri başta olmak üzere birçok alanda kendimi geliştirdim. Özellikle <b className="text-white">Python</b>, <b className="text-white">Java</b>, <b className="text-white">web</b> (HTML, CSS, JavaScript, React), <b className="text-white">AI</b> ve <b className="text-white">Unity/C#</b> ile projeler üretmekten büyük keyif alıyorum. Ayrıca PHP ile de çeşitli web projeleri geliştirdim.
              </p>
              <p className="mb-4">
                Python ve Java tarafında ileri düzeyde bilgi sahibiyim ve bu dillerle birden çok proje geliştirdim. Web ve yapay zeka (AI) alanında da birçok uygulama ve çözüm ürettim. Django ve Flask ile backend, React ile modern frontend projeleri hayata geçirdim. Unity ve C# ile oyun geliştirme deneyimim de bulunuyor.
              </p>
              <p>
                Yazılımı gerçekten severek yapıyorum ve her yeni projede hem kendimi hem de kullandığım teknolojileri daha ileriye taşımaya çalışıyorum. Farklı alanlarda (özellikle Python, Java, web ve AI) çok sayıda proje geliştirdim bu süreçte hem teknik hem de problem çözme becerilerimi sürekli geliştirdim. Yazılım geliştirme benim için bir işten çok bir tutku ve yaşam biçimi.
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
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Yeteneklerim</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl p-3 sm:p-4 text-center border border-primary/30 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-default"
                >
                  <span className="font-semibold text-white text-sm sm:text-base">
                    {skill}
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
          <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Hedeflerim</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Kısa Vadeli</h3>
                <ul className="space-y-2 text-white/90">
                  <li>• Yeni teknolojiler öğrenmek</li>
                  <li>• Açık kaynak projelere katkıda bulunmak</li>
                  <li>• Daha fazla proje geliştirmek</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Uzun Vadeli</h3>
                <ul className="space-y-2 text-white/90">
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
