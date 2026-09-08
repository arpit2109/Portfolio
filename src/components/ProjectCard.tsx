import { useRef, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { itemFadeUp } from '../utils/animations';

const CardContainer = styled(motion.div)`
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 1.75rem;
  cursor: none;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
  transform-style: preserve-3d;
  perspective: 1000px;

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.06);
  }
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const TechTag = styled.span`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-family: 'Space Grotesk', sans-serif;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #777;
`;

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
}

export function ProjectCard({ title, description, tags }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <CardContainer
      ref={cardRef}
      variants={itemFadeUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.15s ease-out, border-color 0.4s ease, box-shadow 0.4s ease' }}
    >
      <h3
        className="text-lg font-semibold mb-3"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f5f5f5' }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: '#888' }}>
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag) => (
          <TechTag key={tag}>{tag}</TechTag>
        ))}
      </div>
    </CardContainer>
  );
}
