'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Circle } from 'lucide-react';
import { NOTICE_DATA } from './data/legalText';
import { motion, AnimatePresence } from 'framer-motion';

interface NoticeAccordionProps {
  onComplete: () => void;
}

interface Section {
  id: string;
  title: string;
  content: string[];
}

export const NoticeAccordion: React.FC<NoticeAccordionProps> = ({ onComplete }) => {
  const sections: Section[] = NOTICE_DATA.notice_2026_en;
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [readSections, setReadSections] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setOpenSectionId(openSectionId === id ? null : id);
    if (!readSections.has(id)) {
      const newRead = new Set(readSections);
      newRead.add(id);
      setReadSections(newRead);
      if (newRead.size === sections.length) {
        onComplete();
      }
    }
  };

  const parseText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part: string, index: number) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-3">
      {sections.map((section: Section) => {
        const isOpen = openSectionId === section.id;
        const isRead = readSections.has(section.id);

        return (
          <div
            key={section.id}
            className={`border rounded-lg transition-colors duration-200 overflow-hidden ${isOpen ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200 bg-white'}`}
          >
            <button
              onClick={() => handleToggle(section.id)}
              className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
            >
              <div className="flex items-center gap-3">
                {isRead ? (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                )}
                <span className={`font-medium ${isOpen ? 'text-blue-800' : 'text-gray-900'}`}>
                  {section.title}
                </span>
              </div>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-blue-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 pb-4 pt-0 text-sm text-gray-600 leading-relaxed border-t border-blue-100/50">
                    <div className="pt-4 space-y-3">
                      {section.content.map((block: string, idx: number) => {
                        const isBullet = block.trim().startsWith('•');
                        if (isBullet) {
                          return (
                            <div key={idx} className="flex items-start pl-2">
                              <span className="mr-2 text-gray-400 select-none">•</span>
                              <span className="text-gray-700">{parseText(block.replace('•', '').trim())}</span>
                            </div>
                          );
                        }
                        return <p key={idx}>{parseText(block)}</p>;
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};