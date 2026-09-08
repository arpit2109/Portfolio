import styled from 'styled-components';

export const GlassCard = styled.div<{ $glow?: boolean }>`
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    border-color: rgba(255, 255, 255, 0.14);
    box-shadow: ${({ $glow }) =>
      $glow ? '0 0 30px rgba(255,255,255,0.08), inset 0 0 30px rgba(255,255,255,0.02)' : 'none'};
  }
`;

export const GlassCardInner = styled.div`
  padding: 2rem;
`;
