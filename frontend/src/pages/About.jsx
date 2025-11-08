import React from 'react';
import { Brain, Mail, FileText } from 'lucide-react';
import Layout from '../components/Layout';

const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-100 rounded-2xl">
              <Brain className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">About Oratio</h1>
          </div>

          <div className="prose max-w-none text-slate-600 space-y-6">
            <p className="text-xl leading-relaxed">
              Oratio is where arguments meet intelligence. We're building the future of debate
              training through AI-powered analysis and real-time feedback.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Our Mission</h2>
            <p>
              We believe that effective argumentation is a skill everyone can master. Our platform
              combines cutting-edge AI technology with proven debate methodologies to help you
              improve your logic, credibility, and rhetoric in every argument.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">The LCR Model</h2>
            <p>
              Our AI judges evaluate debates using the LCR framework:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Logic (40%):</strong> Reasoning strength and argument structure</li>
              <li><strong>Credibility (35%):</strong> Evidence quality and fact verification</li>
              <li><strong>Rhetoric (25%):</strong> Persuasiveness and delivery effectiveness</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8">Technology</h2>
            <p>
              Powered by advanced language models and real-time web search, Oratio provides
              instant, actionable feedback on every argument you make. Whether you're debating
              via text or voice, our AI adapts to your style and helps you grow.
            </p>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
              <div className="flex flex-col gap-4">
                <a
                  href="mailto:contact@oratio.ai"
                  className="flex items-center gap-3 text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>contact@oratio.ai</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>Terms of Service</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
