//import React from 'react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PAOState, NumberInputs } from '../App';

interface PAOCardsProps {
  paoState: PAOState;
  defaultPAOData: Record<number, { person: string, action: string, object: string, images: { person: string, action: string, object: string } }>;
  numberInputs: NumberInputs;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 }
  })
};

export function PAOCards({ paoState, defaultPAOData, numberInputs }: PAOCardsProps) {
  const getImageForPAO = (type: 'person' | 'action' | 'object') => {
    let imageUrl = '';
    
    if (type === 'person') {
      const num = parseInt(numberInputs.person);
      if (num && defaultPAOData[num]) {
        imageUrl = defaultPAOData[num].images.person;
      }
    } else if (type === 'action') {
      const num = parseInt(numberInputs.action);
      if (num && defaultPAOData[num]) {
        imageUrl = defaultPAOData[num].images.action;
      }
    } else if (type === 'object') {
      const num = parseInt(numberInputs.object);
      if (num && defaultPAOData[num]) {
        imageUrl = defaultPAOData[num].images.object;
      }
    }
    
    return imageUrl || `https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=60`;
  };

  const cards = [
    {
      type: 'person' as const,
      emoji: '🧍',
      title: 'Person',
      value: paoState.person,
      number: numberInputs.person,
      gradient: 'from-rose-500/10 via-pink-400/5 to-transparent'
    },
    {
      type: 'action' as const,
      emoji: '🤸',
      title: 'Action',
      value: paoState.action,
      number: numberInputs.action,
      gradient: 'from-amber-500/10 via-orange-400/5 to-transparent'
    },
    {
      type: 'object' as const,
      emoji: '📦',
      title: 'Object',
      value: paoState.object,
      number: numberInputs.object,
      gradient: 'from-emerald-500/10 via-green-400/5 to-transparent'
    }
  ];

  return (
    <div className="w-full space-y-4 mb-4">
      {cards.map((card, index) => (
        <motion.div
          key={`${card.type}-${card.value}`}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-3xl shadow-large"
        >
          <div className="relative h-48 overflow-hidden">
            <ImageWithFallback
              src={getImageForPAO(card.type)}
              alt={`${card.title}: ${card.value}`}
              className="w-full h-full object-cover"
            />
            
            {/* Very subtle top gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-b ${card.gradient}`} />
            
            {/* Top number badge */}
            <div className="absolute top-6 right-6 z-20">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-large bg-[rgba(94,94,94,0.2)]">
                <span className="text-white font-bold text-2xl">{card.number}</span>
              </div>
            </div>
            
            {/* Bottom title area with gradient glass effect */}
            <div className="absolute bottom-0 left-0 right-0">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />
              
              {/* Glass morphism overlay */}
              <div className="relative bg-gradient-to-t from-white/25 via-white/15 to-transparent border-white/20">
                <div className="px-6 py-6 bg-[rgba(237,237,237,0)]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{card.emoji}</span>
                    <span className="text-sm font-semibold text-white/90 bg-black/40 px-3 py-1.5 rounded-full border border-white/20 text-[rgba(255,255,255,0.9)]">
                      {card.title}
                    </span>
                  </div>
                  
                  <h4 className="text-white font-bold text-2xl capitalize leading-tight tracking-tight text-[48px]">
                    {card.value || `Enter ${card.title.toLowerCase()}`}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}