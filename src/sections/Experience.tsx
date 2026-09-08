import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionWrapper } from '../components/SectionWrapper';
import { GlassCard, GlassCardInner } from '../components/GlassCard';
import { fadeInUp, staggerContainer, itemFadeUp } from '../utils/animations';
import styled from 'styled-components';

const TimelineLine = styled(motion.div)`
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.06);
  transform-origin: top;
`;

const TimelineDot = styled(motion.div)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #050505;
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: absolute;
  left: 15px;
  top: 2rem;
  z-index: 2;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.1);
`;

const OngoingBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-family: 'Space Grotesk', sans-serif;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.2);
  color: #4ade80;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #4ade80;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

const BULLETS = [
  'Architected a scalable, multi-module ERP system using Django 5.2, DRF, and Celery unifying inventory control, order fulfillment, and organizational management',
  'Engineered a core financial module featuring a multi-owner digital wallet, automated escrow holds, and strict double-entry ledger accounting',
  'Implemented database concurrency controls to prevent inventory race conditions, plus dynamic identity middleware for complex role-based access',
  'Optimized backend data flow: refactored core serializers to eliminate duplication, added advanced sorting/filtering for user data payloads, enhanced e-commerce order APIs with customer/business data integrations',
];

export function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.6'],
  });
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <SectionWrapper id="experience" title="Experience" subtitle="Where I've Worked">
      <div ref={sectionRef} className="relative w-full max-w-3xl mx-auto">
        {/* Timeline line */}
        <TimelineLine style={{ scaleY: lineScaleY }} />

        {/* Timeline entry */}
        <motion.div
          className="relative pl-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <TimelineDot
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
          />

          <motion.div variants={fadeInUp}>
            <GlassCard $glow>
              <GlassCardInner>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3
                    className="text-lg font-semibold"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f5f5f5' }}
                  >
                    Tesseract Technolabs
                  </h3>
                  <OngoingBadge>
                    <span className="dot" />
                    Ongoing
                  </OngoingBadge>
                </div>

                <p className="text-sm mb-1" style={{ color: '#a0a0a0' }}>
                  Python Developer (Intern)
                </p>
                <p className="text-xs mb-4" style={{ color: '#555' }}>
                  June 2026 — Present
                </p>

                <p
                  className="text-sm font-medium mb-4"
                  style={{ color: '#777', fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Project: Shashan ERP & Financial Management System
                </p>

                <motion.ul
                  className="space-y-3"
                  variants={staggerContainer}
                >
                  {BULLETS.map((bullet, i) => (
                    <motion.li
                      key={i}
                      variants={itemFadeUp}
                      className="text-sm leading-relaxed pl-4 relative"
                      style={{ color: '#a0a0a0' }}
                    >
                      <span
                        className="absolute left-0 top-[0.6em] w-1 h-1 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.3)' }}
                      />
                      {bullet}
                    </motion.li>
                  ))}
                </motion.ul>
              </GlassCardInner>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
