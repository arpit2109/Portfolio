import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styled from 'styled-components';
import { useActiveSection } from '../hooks/useActiveSection';

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const NavContainer = styled(motion.nav)<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  padding: ${({ $scrolled }) => ($scrolled ? '0.75rem 1.5rem' : '1.25rem 1.5rem')};
  background: ${({ $scrolled }) =>
    $scrolled ? 'rgba(5, 5, 5, 0.85)' : 'transparent'};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(20px)' : 'none')};
  -webkit-backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(20px)' : 'none')};
  border-bottom: ${({ $scrolled }) =>
    $scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent'};
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

const NavLink = styled.a<{ $active: boolean }>`
  position: relative;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: ${({ $active }) => ($active ? '#ffffff' : '#777777')};
  cursor: none;
  transition: color 0.3s ease;
  padding: 0.25rem 0;

  &:hover {
    color: #ffffff;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1px;
    background: #ffffff;
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  useEffect(() => {
    const unsub = bgOpacity.on('change', (v) => setScrolled(v > 0.3));
    return unsub;
  }, [bgOpacity]);

  return (
    <NavContainer $scrolled={scrolled}>
      <div className="w-full max-w-[1120px] mx-auto">
        <div className="flex items-center justify-between px-2 sm:px-4">
          {/* Logo */}
          <motion.a
            href="#hero"
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#f5f5f5' }}
            whileHover={{ scale: 1.05 }}
          >
            AP<span style={{ color: '#777' }}>.</span>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.id} href={`#${link.id}`} $active={activeSection === link.id}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ cursor: 'none' }}
          >
            <motion.span
              className="block w-6 h-[1.5px] bg-white"
              animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="block w-6 h-[1.5px] bg-white"
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="block w-6 h-[1.5px] bg-white"
              animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden overflow-hidden"
          initial={false}
          animate={mobileOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-4 pt-6 pb-4 px-2 sm:px-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.id}
                href={`#${link.id}`}
                $active={activeSection === link.id}
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '1rem' }}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </motion.div>
      </div>
    </NavContainer>
  );
}
