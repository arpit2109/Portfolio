import { motion } from 'framer-motion';
import { SectionWrapper } from '../components/SectionWrapper';
import { GlassCard, GlassCardInner } from '../components/GlassCard';
import { fadeInUp, itemFadeUp } from '../utils/animations';
import styled from 'styled-components';

const StatusChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-family: 'Space Grotesk', sans-serif;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a0a0a0;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    color: #f5f5f5;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4ade80;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

export function About() {
  return (
    <SectionWrapper id="about" title="About Me" subtitle="Who I Am">
      <motion.div variants={fadeInUp} className="w-full max-w-3xl mx-auto">
        <GlassCard $glow>
          <GlassCardInner>
            <motion.p
              variants={itemFadeUp}
              className="text-base md:text-lg leading-relaxed mb-6"
              style={{ color: '#a0a0a0' }}
            >
              Innovative IT student specializing in backend architecture, API integration,
              and full-stack development. Experienced in building robust web platforms
              and data extraction pipelines using Python, Django, and React. Eager to
              engineer secure, scalable software systems that solve real-world problems.
            </motion.p>

            <motion.p
              variants={itemFadeUp}
              className="text-base leading-relaxed mb-8"
              style={{ color: '#777' }}
            >
              With hands-on experience in developing ERP systems, predictive analytics
              platforms, and job aggregation tools, I bring a deep understanding of
              backend optimization, database design, and API architecture to every
              project I take on.
            </motion.p>

            <motion.div variants={itemFadeUp} className="flex flex-wrap gap-3">
              <StatusChip>
                <span className="dot" />
                Python Dev Intern @ Tesseract Technolabs
              </StatusChip>
              <StatusChip>🎓 Sem 6 — LJ University, Ahmedabad</StatusChip>
              <StatusChip>🎯 Expected Graduation 2027</StatusChip>
            </motion.div>
          </GlassCardInner>
        </GlassCard>
      </motion.div>
    </SectionWrapper>
  );
}
