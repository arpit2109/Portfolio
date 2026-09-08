import { motion } from 'framer-motion';
import { SectionWrapper } from '../components/SectionWrapper';
import { GlassCard, GlassCardInner } from '../components/GlassCard';
import { staggerContainer, itemFadeUp } from '../utils/animations';

const ACHIEVEMENTS = [
  { icon: '🏆', text: 'Participated in 1 Hackathon — secured top 50' },
  { icon: '🌐', text: 'Participated in latest open-source project discussions' },
  { icon: '🥈', text: 'Silver medal, Maths Olympiad' },
  { icon: '🇮🇳', text: 'Represented the college in Smart India Hackathon (SIH)' },
];

export function Achievements() {
  return (
    <SectionWrapper id="achievements" title="Achievements" subtitle="Milestones">
      <motion.div
        className="w-full max-w-2xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <GlassCard $glow>
          <GlassCardInner>
            <div className="space-y-4">
              {ACHIEVEMENTS.map((a, i) => (
                <motion.div
                  key={i}
                  variants={itemFadeUp}
                  className="flex items-start gap-4 group"
                >
                  <span className="text-xl flex-shrink-0">{a.icon}</span>
                  <p
                    className="text-sm leading-relaxed transition-colors duration-300 group-hover:text-white"
                    style={{ color: '#a0a0a0' }}
                  >
                    {a.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </GlassCardInner>
        </GlassCard>
      </motion.div>
    </SectionWrapper>
  );
}
