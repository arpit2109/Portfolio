import { motion } from 'framer-motion';
import { SectionWrapper } from '../components/SectionWrapper';
import { ProjectCard } from '../components/ProjectCard';
import { staggerContainer } from '../utils/animations';

const PROJECTS = [
  {
    title: 'LuxeLounge',
    description:
      'Predictive analytics and management platform for hospitality. Django REST APIs + custom data pipelines + scikit-learn models to forecast hotel occupancy and drive data-driven decisions.',
    tags: ['Django', 'REST API', 'scikit-learn', 'Python', 'Analytics'],
  },
  {
    title: 'Job-Aggregator',
    description:
      'Scalable job aggregation platform using Python, Selenium, Django, and React. Robust scraping pipelines extracting, normalizing, and serving data from LinkedIn and Indeed while navigating anti-bot measures.',
    tags: ['Python', 'Selenium', 'Django', 'React', 'Scraping'],
  },
  {
    title: 'AI Solver',
    description:
      'Python-based automation script for rapid AI-driven problem solving: captures screen data, leverages AI models for analysis, pushes solutions via mobile notifications.',
    tags: ['Python', 'AI', 'Automation', 'OCR'],
  },
  {
    title: 'Global Pulse Gold Predictor',
    description:
      'Predictive analytics engine synthesizing financial datasets with real-time global market signals; ML-driven gold trend forecasting.',
    tags: ['Machine Learning', 'Finance', 'Python', 'Analytics'],
  },
  {
    title: 'Algorithmic Visualization System',
    description:
      'Interactive educational app visualizing step-by-step mechanics of algorithms (Dynamic Programming, Greedy strategies), bridging CS theory and intuitive UI.',
    tags: ['React', 'Algorithms', 'Visualization', 'Education'],
  },
];

export function Projects() {
  return (
    <SectionWrapper id="projects" title="Projects" subtitle="What I've Built">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {PROJECTS.map((project) => (
          <div key={project.title} className="w-full flex">
            <ProjectCard {...project} />
          </div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
