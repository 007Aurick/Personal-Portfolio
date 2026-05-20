import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const serviceID = 'service_k6k4c9d';
    const templateID = 'template_qdwhf3b';
    const publicKey = 'vLTpZM41_YYRBnWZ7';

    emailjs
      .send(serviceID, templateID, formData, publicKey)
      .then(() => {
        setIsSubmitting(false);
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });

        setTimeout(() => setSubmitStatus(''), 3000);
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        setIsSubmitting(false);
        setSubmitStatus('error');
      });
  };

  const contactInfo = [
    {
      icon: '✦',
      title: 'Email',
      value: 'aurick.anwar2260biga@gmail.com',
      link: 'mailto:aurick.anwar2260biga@gmail.com',
    },
    {
      icon: '✦',
      title: 'Location',
      value: 'Toronto, Ontario, Canada',
      link: '#',
    },
    {
      icon: '✦',
      title: 'Twitter',
      value: 'x.com/007Aurick',
      link: 'https://x.com/007Aurick',
    },
    {
      icon: '✦',
      title: 'Instagram',
      value: 'instagram.com/_aur1ck/',
      link: 'https://www.instagram.com/_aur1ck/',
    },
  ];

  return (
    <section className="contact section">
      <div className="container">
        <div className="section-header fade-in-up">
          <h1 className="section-title">Get In Touch</h1>
          <p className="section-subtitle">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you!
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info fade-in-up">
            <h3>Let&apos;s Connect</h3>
            <p>
              I&apos;m open to internships, collaborations, and product-focused engineering
              opportunities.
            </p>

            <div className="contact-details">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.link}
                  className="contact-item"
                  target={info.link.startsWith('http') ? '_blank' : '_self'}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                >
                  <div className="contact-icon">{info.icon}</div>
                  <div className="contact-text">
                    <h4>{info.title}</h4>
                    <p>{info.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="contact-form-container fade-in-up">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitStatus === 'success' && (
                <div className="submit-success">
                  ✅ Message sent successfully! I&apos;ll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="submit-error">
                  ❌ Oops, something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
