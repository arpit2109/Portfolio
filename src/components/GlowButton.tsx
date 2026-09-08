import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledButton = styled(motion.a)<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.8rem;
  border-radius: 9999px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  cursor: none;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-decoration: none;
  position: relative;
  overflow: hidden;

  ${({ $variant }) =>
    $variant === 'secondary'
      ? `
    background: transparent;
    color: #f5f5f5;
    border: 1px solid rgba(255,255,255,0.15);

    &:hover {
      border-color: rgba(255,255,255,0.35);
      box-shadow: 0 0 20px rgba(255,255,255,0.06);
    }
  `
      : `
    background: #ffffff;
    color: #050505;
    border: 1px solid transparent;

    &:hover {
      box-shadow: 0 0 30px rgba(255,255,255,0.2);
      transform: translateY(-1px);
    }
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  download?: boolean;
}

export function GlowButton({ children, href, onClick, variant = 'primary', download }: GlowButtonProps) {
  return (
    <StyledButton
      href={href}
      onClick={onClick}
      $variant={variant}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      download={download}
    >
      {children}
    </StyledButton>
  );
}
