// app/contact/page.tsx
'use client';

import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

export default function ContactPage() {

  const contactMethods = [
    {
      icon: FiMail,
      title: "Email Support",
      content: "team@resumeiq.com",
      link: "mailto:team@resumeiq.com"
    },
    {
      icon: FiPhone,
      title: "Phone Support",
      content: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: FiMapPin,
      title: "HQ Location",
      content: "San Francisco, CA",
      link: "https://maps.app.goo.gl/example"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-8 leading-tight"
          >
            Get in Touch with Our<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              Support Team
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto"
          >
            Have questions or need assistance? Our team is here to help you make the most of ResumeIQ's powerful features.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Methods */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <method.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {method.title}
                      </h3>
                      <a
                        href={method.link}
                        className="text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        {method.content}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Office Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-8 bg-white rounded-2xl shadow-sm"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Office Hours
                </h3>
                <div className="space-y-2 text-slate-600">
                  <p>Monday - Friday: 9 AM - 6 PM PST</p>
                  <p>Saturday: 10 AM - 2 PM PST</p>
                  <p>Sunday: Closed</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-sm"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                Send Us a Message
              </h2>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  type="submit"
                >
                  <FiSend className="w-5 h-5" />
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl h-96"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            {/* Replace with actual map component */}
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              Map placeholder (integrate your preferred map service)
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <motion.p
            className="text-lg text-blue-50 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Check out our comprehensive FAQ section or browse our documentation
          </motion.p>
          <div className="flex justify-center gap-4">
            <motion.a
              href="/faq"
              className="inline-flex items-center justify-center gap-3 bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Visit FAQ
            </motion.a>
            <motion.a
              href="/docs"
              className="inline-flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Documentation
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
}