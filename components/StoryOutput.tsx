//import React from 'react';
import { motion } from 'framer-motion';
import { PAOState } from '../App';

interface StoryOutputProps {
  paoState: PAOState;
}

export function StoryOutput({ paoState }: StoryOutputProps) {
  const generateColoredStory = () => {
    const { person, action, object } = paoState;
    
    if (!person || !action || !object || 
        person === 'Unknown' || action === 'unknown' || object === 'unknown') {
      return <span className="text-muted-foreground">Enter numbers to generate your memory story</span>;
    }
    
    const stories = [
      {
        text: "The ",
        components: [
          { type: 'person', value: person },
          { text: " is " },
          { type: 'action', value: action },
          { text: " with a " },
          { type: 'object', value: object }
        ]
      },
      {
        text: "I see a ",
        components: [
          { type: 'person', value: person },
          { text: " " },
          { type: 'action', value: action },
          { text: " around a " },
          { type: 'object', value: object }
        ]
      },
      {
        text: "A ",
        components: [
          { type: 'person', value: person },
          { text: " starts " },
          { type: 'action', value: action },
          { text: " near the " },
          { type: 'object', value: object }
        ]
      },
      {
        text: "The ",
        components: [
          { type: 'person', value: person },
          { text: " carefully " },
          { type: 'action', value: action },
          { text: " using the " },
          { type: 'object', value: object }
        ]
      },
      {
        text: "Imagine a ",
        components: [
          { type: 'person', value: person },
          { text: " " },
          { type: 'action', value: action },
          { text: " while holding a " },
          { type: 'object', value: object }
        ]
      }
    ];
    
    const selectedStory = stories[Math.floor(Math.random() * stories.length)];
    
    const getColorClass = (type: string) => {
      switch (type) {
        case 'person':
          return 'pao-person font-semibold px-1 rounded';
        case 'action':
          return 'pao-action font-semibold px-1 rounded';
        case 'object':
          return 'pao-object font-semibold px-1 rounded';
        default:
          return '';
      }
    };
    
    return (
      <span>
        {selectedStory.text}
        {selectedStory.components.map((component, index) => (
          <span key={index}>
            {component.type ? (
              <span className={getColorClass(component.type)}>
                {component.value}
              </span>
            ) : (
              component.text
            )}
          </span>
        ))}
      </span>
    );
  };

  return (
    <motion.div
      key={`${paoState.person}-${paoState.action}-${paoState.object}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      <div className="story-glass rounded-3xl p-3 shadow-medium">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">📖</span>
          </div>
          <div className="text-lg leading-relaxed text-foreground/90 flex-1 text-[14px]">
            {generateColoredStory()}
          </div>
        </div>
      </div>
    </motion.div>
  );
}