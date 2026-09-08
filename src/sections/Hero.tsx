import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import styled from 'styled-components';
import { HeroScene } from '../components/three/HeroScene';
import { GlowButton } from '../components/GlowButton';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { FiDownload, FiArrowRight, FiChevronDown } from 'react-icons/fi';

const PhotoFrame = styled(motion.div)`
  position: relative;
  width: 320px;
  height: 400px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.05);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%,
      rgba(255, 255, 255, 0.03) 100%
    );
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    filter: grayscale(30%) brightness(0.9);
  }

  @media (max-width: 768px) {
    width: 220px;
    height: 280px;
    border-radius: 20px;
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #777;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  font-family: 'Space Grotesk', sans-serif;
`;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden snap-start scroll-mt-0"
      style={{ background: '#050505ff' }}
    >
      {/* 3D Background */}
      <HeroScene />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.02) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.015) 0%, transparent 50%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-[1120px] mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center"
        style={{ opacity }}
      >
        {/* Text Column */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ y: textY }}
          className="order-2 md:order-1"
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs uppercase tracking-[0.3em] mb-4"
            style={{ color: '#777', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Full-Stack Developer
          </motion.p>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Arpit Rasikbhai
            <br />
            <span style={{ color: '#a0a0a0' }}>Patel</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-base md:text-lg leading-relaxed mb-4 max-w-md"
            style={{ color: '#a0a0a0' }}
          >
            Innovative IT student specializing in backend architecture, API
            integration, and full-stack development.
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="text-sm mb-8 flex items-center gap-2"
            style={{ color: '#555' }}
          >
            📍 Ahmedabad, Gujarat, India
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
            <GlowButton href="#projects">
              View Projects <FiArrowRight />
            </GlowButton>
            <GlowButton href="#contact" variant="secondary">
              Get in Touch
            </GlowButton>
            <GlowButton
              href="/assets/resume.pdf"
              variant="secondary"
              download
            >
              Resume <FiDownload />
            </GlowButton>
          </motion.div>
        </motion.div>

        {/* Photo Column */}
        <motion.div
          className="order-1 md:order-2 flex justify-center md:justify-end"
          style={{ y: photoY }}
        >
          <PhotoFrame
            initial={{ opacity: 0, scale: 0.9, clipPath: 'inset(100% 0 0 0)' }}
            animate={{
              opacity: 1,
              scale: 1,
              clipPath: 'inset(0% 0 0 0)',
            }}
            transition={{
              duration: 1,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.3,
            }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '100%', height: '100%' }}
            >
              <img
                src="/assets/profile.webp"
                alt="Arpit Rasikbhai Patel"
                loading="eager"
              />
            </motion.div>
          </PhotoFrame>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span>SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FiChevronDown size={18} />
        </motion.div>
      </ScrollIndicator>
    </section>
  );
}
