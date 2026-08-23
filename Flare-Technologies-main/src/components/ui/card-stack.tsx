import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Card {
  id: number;
  title: string;
  description: string;
  color: string;
}

interface CardStackProps {
    items: { title: string; description: string; color: string }[];
}

export function CardStack({ items }: CardStackProps) {
  const initialCards: Card[] = items.map((item, idx) => ({
    id: idx + 1,
    ...item
  }));

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);

  const dragY = useMotionValue(0);
  const rotateX = useTransform(dragY, [-200, 0, 200], [15, 0, -15]);

  const offset = 12;
  const scaleStep = 0.05;
  const dimStep = 0.2;
  const swipeThreshold = 50;

  const spring = {
    type: 'spring' as const,
    stiffness: 170,
    damping: 26
  };

  const moveToEnd = () => {
    setCards(prev => [...prev.slice(1), prev[0]]);
    setCurrentIndex((prev) => (prev + 1) % initialCards.length);
  };

  const moveToStart = () => {
    setCards(prev => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    setCurrentIndex((prev) => (prev - 1 + initialCards.length) % initialCards.length);
  };

  const handleDragEnd = (_: any, info: any) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (Math.abs(offset) > swipeThreshold || Math.abs(velocity) > 500) {
      if (offset < 0 || velocity < 0) {
        moveToEnd();
      } else {
        moveToStart();
      }
    }
    dragY.set(0);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-8 overflow-visible">

      {/* Card Stack Container */}
      <div className="relative w-[280px] sm:w-[480px] h-[160px] z-10">
        <ul className="relative w-full h-full m-0 p-0">
          <AnimatePresence initial={false}>
            {cards.map(({ id, title, description, color }, i) => {
              const isFront = i === 0;
              const brightness = Math.max(0.4, 1 - i * dimStep);
              
              return (
                <motion.li
                  key={id}
                  className="absolute w-full h-full list-none p-6 flex flex-col justify-center text-center"
                  style={{
                    background: color,
                    borderRadius: '20px',
                    cursor: isFront ? 'grab' : 'auto',
                    touchAction: 'none',
                    boxShadow: isFront ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
                    rotateX: isFront ? rotateX : 0,
                    transformPerspective: 1000,
                  }}
                  animate={{
                    top: `${i * -offset}px`,
                    scale: 1 - i * scaleStep,
                    filter: `brightness(${brightness})`,
                    zIndex: cards.length - i,
                  }}
                  transition={spring}
                  drag={isFront ? 'y' : false}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.5}
                  onDragEnd={handleDragEnd}
                >
                  <h3 className="text-[#121620] font-black text-base mb-2 uppercase">{title}</h3>
                  <p className="text-[#121620]/80 text-sm font-medium leading-relaxed">{description}</p>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>

      {/* Manual Navigation Buttons */}
      <div className="mt-12 flex items-center gap-5 z-20">
        <button onClick={moveToStart} className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5">
            {initialCards.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex % initialCards.length ? "bg-[#FF8C00] w-6" : "bg-white/10 w-1"}`} />
            ))}
        </div>
        <button onClick={moveToEnd} className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
