import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import styled from 'styled-components';
import { staggerContainer, fadeInUp } from '../utils/animations';

export const CONTENT_MAX_WIDTH = '1120px';

const Section = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  scroll-margin-top: 6rem;
  padding: 6.5rem 1.5rem;

  @media (min-width: 768px) {
    padding: 8rem 2rem;
  }
`;

const Inner = styled(motion.div)<{ $wide?: boolean }>`
  width: 100%;
  max-width: ${({ $wide }) => ($wide ? '1200px' : CONTENT_MAX_WIDTH)};
  margin: 0 auto;
`;

const Header = styled(motion.div)`
  margin-bottom: 3.5rem;
  text-align: center;
`;

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  isWide?: boolean;
}

export function SectionWrapper({ id, children, title, subtitle, className = '', isWide = false }: SectionWrapperProps) {
  return (
    <Section id={id} className={`snap-start ${className}`}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[70%] max-w-2xl"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)' }}
      />

      <Inner
        $wide={isWide}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {(title || subtitle) && (
          <Header variants={fadeInUp}>
            {subtitle && (
              <p
                className="text-xs uppercase tracking-[0.3em] mb-3"
                style={{ color: '#777777', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {subtitle}
              </p>
            )}
            {title && (
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f5f5f5' }}
              >
                {title}
              </h2>
            )}
            <div className="mt-4 mx-auto w-16 h-[1px] bg-white/10" />
          </Header>
        )}
        {children}
      </Inner>
    </Section>
  );
}
