'use client';

import { motion } from 'framer-motion';

const boxVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

export default function HowItWorks() {
  const steps = [
    {
      title: 'Create Account',
      color: 'blue',
      svg: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      ),
    },
    {
      title: 'Submit Your Pitch',
      color: 'green',
      svg: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      ),
    },
    {
      title: 'Connect With Investors',
      color: 'purple',
      svg: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      ),
    },
    {
      title: 'Get Funded',
      color: 'orange',
      svg: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      ),
    },
  ];

  return (
    <section id="work" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-left">How It Works</h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={boxVariants}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center"
            >
              <div className={`bg-${step.color}-100 p-2 rounded-full mr-3`}>
                <svg
                  className={`w-5 h-5 text-${step.color}-600`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {step.svg}
                </svg>
              </div>
              <h3 className="text-gray-700 font-medium">{step.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
