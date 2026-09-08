import { motion } from 'framer-motion';
import { SectionWrapper } from '../components/SectionWrapper';
import { staggerFast, itemFadeUp } from '../utils/animations';
import styled from 'styled-components';

const CertBadge = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: default;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }

  .icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }
`;

const CERTIFICATES = [
  { name: 'Exploratory Data Analysis for Machine Learning', issuer: 'IBM' },
  { name: 'Introduction to HTML, CSS & JavaScript', issuer: 'IBM' },
  { name: 'Inheritance and Data Structures in Java', issuer: 'University of Pennsylvania' },
  { name: 'Introduction to Java', issuer: 'LearnQuest' },
];

export function Certificates() {
  return (
    <SectionWrapper id="certificates" title="Certificates" subtitle="Certified Skills">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto"
        variants={staggerFast}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {CERTIFICATES.map((cert) => (
          <div key={cert.name} className="w-full">
            <CertBadge variants={itemFadeUp}>
              <div className="icon">🏅</div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#f5f5f5' }}>
                  {cert.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#777' }}>
                  {cert.issuer}
                </p>
              </div>
            </CertBadge>
          </div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
