import { FiLinkedin, FiMail, FiHeart } from 'react-icons/fi';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: #050505;
`;

const SocialLink = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  transition: all 0.3s ease;
  cursor: none;

  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.06);
  }
`;

export function Footer() {
  return (
    <FooterContainer>
      <div className="w-full max-w-[1120px] mx-auto px-2 sm:px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs flex items-center gap-1" style={{ color: '#555' }}>
          © {new Date().getFullYear()} Arpit Patel. Built with <FiHeart size={12} /> React & Three.js
        </p>

        <div className="flex items-center gap-3">
          <SocialLink href="mailto:patelarpit4242@gmail.com" aria-label="Email">
            <FiMail size={16} />
          </SocialLink>
          <SocialLink
            href="https://linkedin.com/in/arpit-r-patel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FiLinkedin size={16} />
          </SocialLink>
        </div>
      </div>
    </FooterContainer>
  );
}
