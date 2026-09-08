import { motion } from 'framer-motion';
import type { IconType } from 'react-icons';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiMysql,
  SiReact,
  SiExpress,
  SiNodedotjs,
  SiNextdotjs,
  SiMongodb,
  SiPython,
  SiPhp,
  SiOpenjdk,
  SiBootstrap,
  SiTailwindcss,
  SiDjango,
  SiDotnet,
  SiAngular,
  SiNumpy,
  SiPandas,
  SiScikitlearn,
} from 'react-icons/si';
import { TbBrandCSharp, TbChartHistogram, TbBrain, TbBinaryTree } from 'react-icons/tb';
import { FiSearch, FiUsers, FiMessageCircle, FiUserCheck, FiClock } from 'react-icons/fi';
import { SectionWrapper } from '../components/SectionWrapper';
import { staggerContainer, staggerFast, itemFadeUp, fadeInUp } from '../utils/animations';
import styled from 'styled-components';

const SkillIcon = styled(motion.span)<{ $accent: string }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.4rem;
  height: 3.4rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #c8c8c8;
  cursor: default;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  svg {
    width: 1.55rem;
    height: 1.55rem;
    transition: color 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 22px rgba(255, 255, 255, 0.08);
    color: ${({ $accent }) => $accent};

    .skill-tip {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

const SkillTip = styled.span.attrs({ className: 'skill-tip' })`
  position: absolute;
  left: 50%;
  bottom: calc(100% + 0.45rem);
  transform: translateX(-50%) translateY(4px);
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
  font-size: 0.68rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
  color: #f5f5f5;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 2;
`;

interface SkillItem {
  name: string;
  icon: IconType;
  accent: string;
}

const SKILLS: { category: string; skills: SkillItem[] }[] = [
  {
    category: 'Web Development',
    skills: [
      { name: 'HTML', icon: SiHtml5, accent: '#E34F26' },
      { name: 'CSS', icon: SiCss, accent: '#663399' },
      { name: 'JavaScript', icon: SiJavascript, accent: '#F7DF1E' },
      { name: 'MySQL', icon: SiMysql, accent: '#4479A1' },
      { name: 'React', icon: SiReact, accent: '#61DAFB' },
      { name: 'Express', icon: SiExpress, accent: '#ffffff' },
      { name: 'Node.js', icon: SiNodedotjs, accent: '#339933' },
      { name: 'Next.js', icon: SiNextdotjs, accent: '#ffffff' },
      { name: 'MongoDB', icon: SiMongodb, accent: '#47A248' },
    ],
  },
  {
    category: 'Programming Languages',
    skills: [
      { name: 'Java', icon: SiOpenjdk, accent: '#ED8B00' },
      { name: 'Python', icon: SiPython, accent: '#3776AB' },
      { name: 'PHP', icon: SiPhp, accent: '#777BB4' },
      { name: 'C#', icon: TbBrandCSharp, accent: '#512BD4' },
      { name: 'JavaScript', icon: SiJavascript, accent: '#F7DF1E' },
    ],
  },
  {
    category: 'Frameworks',
    skills: [
      { name: 'Bootstrap', icon: SiBootstrap, accent: '#7952B3' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, accent: '#06B6D4' },
      { name: 'Django', icon: SiDjango, accent: '#44B78B' },
      { name: 'ASP.NET', icon: SiDotnet, accent: '#512BD4' },
      { name: 'AngularJS', icon: SiAngular, accent: '#DD0031' },
    ],
  },
  {
    category: 'Machine Learning',
    skills: [
      { name: 'Supervised Learning', icon: TbBrain, accent: '#ffffff' },
      { name: 'Unsupervised Learning', icon: TbBinaryTree, accent: '#ffffff' },
      { name: 'NumPy', icon: SiNumpy, accent: '#4DABCF' },
      { name: 'Pandas', icon: SiPandas, accent: '#E70488' },
      { name: 'Matplotlib', icon: TbChartHistogram, accent: '#11557C' },
      { name: 'Scikit-learn', icon: SiScikitlearn, accent: '#F7931E' },
    ],
  },
  {
    category: 'Soft Skills',
    skills: [
      { name: 'Research', icon: FiSearch, accent: '#ffffff' },
      { name: 'Leadership', icon: FiUserCheck, accent: '#ffffff' },
      { name: 'Peer Interaction', icon: FiMessageCircle, accent: '#ffffff' },
      { name: 'Team Management', icon: FiUsers, accent: '#ffffff' },
      { name: 'Time Management', icon: FiClock, accent: '#ffffff' },
    ],
  },
];

export function Skills() {
  return (
    <SectionWrapper id="skills" title="Skills" subtitle="What I Work With">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 w-full justify-items-center"
        variants={staggerContainer}
      >
        {SKILLS.map((group) => (
          <motion.div key={group.category} variants={fadeInUp} className="w-full max-w-sm md:max-w-none">
            <h3
              className="text-sm uppercase tracking-[0.2em] mb-4 font-medium"
              style={{ color: '#777', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {group.category}
            </h3>
            <motion.div
              className="flex flex-wrap gap-3"
              variants={staggerFast}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {group.skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <SkillIcon
                    key={skill.name}
                    $accent={skill.accent}
                    variants={itemFadeUp}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    title={skill.name}
                    aria-label={skill.name}
                  >
                    <SkillTip>{skill.name}</SkillTip>
                    <Icon aria-hidden />
                  </SkillIcon>
                );
              })}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
