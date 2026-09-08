import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { SectionWrapper } from '../components/SectionWrapper';
import { GlassCard, GlassCardInner } from '../components/GlassCard';

import { fadeInUp, staggerContainer, itemFadeUp } from '../utils/animations';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiSend, FiCheck } from 'react-icons/fi';
import styled from 'styled-components';

const InputField = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f5f5f5;
  outline: none;
  transition: all 0.3s ease;
  cursor: none;

  &::placeholder {
    color: #555;
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
  }

  &.error {
    border-color: rgba(255, 100, 100, 0.4);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f5f5f5;
  outline: none;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
  cursor: none;

  &::placeholder {
    color: #555;
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
  }

  &.error {
    border-color: rgba(255, 100, 100, 0.4);
  }
`;

const ContactLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: #a0a0a0;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: none;

  &:hover {
    color: #ffffff;
  }

  .icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  &:hover .icon-wrap {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.06);
  }
`;

const CONTACT_INFO = [
  {
    icon: <FiMail size={16} />,
    label: 'patelarpit4242@gmail.com',
    href: 'mailto:patelarpit4242@gmail.com',
  },
  {
    icon: <FiPhone size={16} />,
    label: '+91 9428106893',
    href: 'tel:+919428106893',
  },
  {
    icon: <FiLinkedin size={16} />,
    label: 'Arpit R Patel',
    href: 'https://linkedin.com/in/arpit-r-patel',
  },
  {
    icon: <FiMapPin size={16} />,
    label: 'Ahmedabad, Gujarat, India',
    href: '#',
  },
];

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: false, email: false, message: false });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const validate = () => {
    const newErrors = {
      name: !form.name.trim(),
      email: !form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
      message: !form.message.trim(),
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('sending');

    // EmailJS / Formspree integration placeholder
    // Replace with your EmailJS service/template/user IDs or Formspree endpoint
    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (response.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        // Fallback to mailto
        window.location.href = `mailto:patelarpit4242@gmail.com?subject=Portfolio Contact from ${form.name}&body=${form.message}%0A%0AFrom: ${form.email}`;
        setStatus('idle');
      }
    } catch {
      // Fallback to mailto
      window.location.href = `mailto:patelarpit4242@gmail.com?subject=Portfolio Contact from ${form.name}&body=${form.message}%0A%0AFrom: ${form.email}`;
      setStatus('idle');
    }
  };

  return (
    <SectionWrapper id="contact" title="Get in Touch" subtitle="Contact">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* Contact Info */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p
            variants={fadeInUp}
            className="text-base leading-relaxed mb-8"
            style={{ color: '#888' }}
          >
            Have a project in mind or just want to chat? Feel free to reach out.
            I'm always open to discussing new opportunities.
          </motion.p>

          <div className="space-y-2">
            {CONTACT_INFO.map((info) => (
              <motion.div key={info.label} variants={itemFadeUp}>
                <ContactLink
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                >
                  <div className="icon-wrap">{info.icon}</div>
                  <span>{info.label}</span>
                </ContactLink>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div variants={fadeInUp}>
          <GlassCard $glow>
            <GlassCardInner>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <InputField
                    type="text"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={errors.name ? 'error' : ''}
                  />
                </div>
                <div>
                  <InputField
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                <div>
                  <TextArea
                    placeholder="Your Message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={errors.message ? 'error' : ''}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium text-sm"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: status === 'sent' ? 'rgba(74, 222, 128, 0.15)' : '#ffffff',
                    color: status === 'sent' ? '#4ade80' : '#050505',
                    border: status === 'sent' ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid transparent',
                    cursor: 'none',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {status === 'sent' ? (
                    <>
                      <FiCheck /> Message Sent!
                    </>
                  ) : status === 'sending' ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message <FiSend size={14} />
                    </>
                  )}
                </motion.button>
              </form>
            </GlassCardInner>
          </GlassCard>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
