import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Index.css';
import { useNavigate  } from 'react-router-dom';

import smk93Image from '../images/smk93.jpeg'
import smk92Image from '../images/smk92.jpeg'
import smk94Image from '../images/smk94.jpeg'
export const Landing = () => {
  const navigate = useNavigate();
  const dataDummy = [
    { id: 1, title: 'Presensi online', description: 'Sistem presensi berbasis foto selfie untuk memastikan kehadiran.' },
    { id: 2, title: 'Jurnal Terintegrasi', description: 'Pencatatan aktivitas harian dengan fitur unggah dokumentasi kegiatan yang memudahkan pelaporan dan evaluasi progress magang.' },
    { id: 3, title: 'Monitoring Real-time', description: 'Pemantauan kegiatan magang secara langsung oleh pembimbing dan admin untuk memastikan kualitas pelaksanaan program.' },
    
  ];

  // const handleScroll = () => {
  //   document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  // };
  const handleScroll = () => {
    navigate('/login');
  };

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      document.getElementById('features').scrollBy({
        left: 100,
        behavior: 'smooth'
      });
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="hero-content"
        >
          <h1>SIPEJAM</h1>
          <p>Sistem Informasi Presensi dan Jurnal Aktivitas Magang</p>
          <p></p>
         <button onClick={handleScroll} className="cta-button">Masuk</button>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
         Tentang SIPEJAM
        </motion.h2>
        <p>SIPEJAM hadir sebagai solusi modern untuk mengoptimalkan pengelolaan program magang.
           Sistem ini menggabungkan fitur presensi digital dan pencatatan jurnal kegiatan untuk memastikan dokumentasi 
           yang akurat dan pemantauan yang efektif. Dengan SIPEJAM, proses magang menjadi lebih terstruktur dan transparan bagi semua 
           pihak yang terlibat.</p>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
        Kelebihan Aplikasi
        </motion.h2>
        <div className="features-grid">
          {dataDummy.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="feature-card"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Image and Text Section */}
      <section className="image-text-section">
        <motion.div
          className="image-text-item"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
           <img src={smk92Image} alt="Description 1" className="image" />
          <div className="text">
            <h3>Visi Kami</h3>
            <p>Menjadi platform unggulan dalam pengelolaan program magang yang mendukung pengembangan kompetensi siswa melalui teknologi digital yang terintegrasi.</p>
          </div>
        </motion.div>
        
        <motion.div
          className="image-text-item reverse"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
         <img src={smk93Image} alt="Description 1" className="image" />
          <div className="text">
            <h3>Misi Kami</h3>
            <p>Memfasilitasi proses magang yang terstruktur dan transparan melalui sistem monitoring digital yang efektif, serta mendorong peningkatan kualitas program magang berbasis data.</p>
          </div>
        </motion.div>

        <motion.div
          className="image-text-item"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
            <img src={smk94Image} alt="Description 1" className="image" />
          <div className="text">
            <h3>Nilai-Nilai Kami</h3>
            <p>Kami mengedepankan akuntabilitas, efisiensi, dan inovasi dalam mengembangkan solusi digital untuk mendukung kesuksesan program magang para siswa.</p>
          </div>
        </motion.div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Contact Us
        </motion.h2>
        <div className="footer-content">
          <p><strong>SMK N 9 Semarang</strong></p>
          <p>Jl. Peterongansari No.2, Kota Semarang, Jawa Tengah</p>
          <p>Phone: (024) 3526258</p>
          <p>Email: hello@smkn9smg.com</p>
          <div className="social-icons">
            {/* <Link to="#" className="social-icon">Facebook</Link>
            <Link to="#" className="social-icon">Twitter</Link>
            <Link to="#" className="social-icon">LinkedIn</Link> */}
          </div>
        </div>
      </footer>
    </div>
  );
};
