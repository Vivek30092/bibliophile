import React from 'react';
import { Search, MessageSquare, MapPin, BookOpen, RotateCcw } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Pick',
      desc: 'Browse the collection and choose a book that calls to you.',
      icon: Search
    },
    {
      number: '02',
      title: 'Request',
      desc: 'Tap Rent on WhatsApp to enquire. We confirm availability promptly.',
      icon: MessageSquare
    },
    {
      number: '03',
      title: 'Collect',
      desc: 'Pick up from our home library in Sukhliya, Indore or arrange delivery.',
      icon: MapPin
    },
    {
      number: '04',
      title: 'Read',
      desc: 'Enjoy the book during your rental period at your own pace.',
      icon: BookOpen
    },
    {
      number: '05',
      title: 'Return',
      desc: 'Return the book when finished and receive your refundable deposit back.',
      icon: RotateCcw
    }
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Simple Process
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-100 mt-2">
            How It Works
          </h2>
          <p className="text-stone-400 text-sm sm:text-base font-light mt-3">
            Renting a book from Bibliophile Vibes is as easy and friendly as it gets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="glass-card rounded-2xl p-6 relative flex flex-col justify-between group hover:border-accent/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display font-bold text-2xl text-accent/60 group-hover:text-accent transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-stone-300 group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-stone-100 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
