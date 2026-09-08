import { motion } from 'framer-motion';
import { SectionWrapper } from '../components/SectionWrapper';
import { GlassCard, GlassCardInner } from '../components/GlassCard';
import { fadeInUp } from '../utils/animations';
import { FiBookOpen } from 'react-icons/fi';

export function Education() {
  return (
    <SectionWrapper id="education" title="Education" subtitle="Academic Background">
      <motion.div variants={fadeInUp} className="w-full max-w-2xl mx-auto">
        <GlassCard $glow>
          <GlassCardInner className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <FiBookOpen size={20} color="#a0a0a0" />
            </div>
            <div>
              <h3
                className="text-lg font-semibold mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f5f5f5' }}
              >
                LJ University
              </h3>
              <p className="text-sm mb-1" style={{ color: '#a0a0a0' }}>
                Ahmedabad, Gujarat
              </p>
              <p className="text-sm" style={{ color: '#777' }}>
                Semester 6 — Expected Graduation 2027
              </p>
            </div>
          </GlassCardInner>
        </GlassCard>
      </motion.div>
    </SectionWrapper>
  );
}
