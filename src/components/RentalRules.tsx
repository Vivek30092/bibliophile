import React from 'react';
import { Calendar, Shield, Clock, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';

export const RentalRules: React.FC = () => {
  const rules = [
    {
      title: 'Rental Duration',
      desc: 'Books are rented for 7, 14, or 30 days depending on the title. The duration is stated on each book page.',
      icon: Calendar
    },
    {
      title: 'Security Deposit',
      desc: 'A small refundable security deposit is collected and promptly returned when the book returns in good shape.',
      icon: Shield
    },
    {
      title: 'Late Returns',
      desc: 'Please let us know in advance if you need more time. We are happy to accommodate renewals when available.',
      icon: Clock
    },
    {
      title: 'Book Condition',
      desc: 'Please treat each book gently. Significant tears or spills beyond normal gentle reading wear may deduct from deposit.',
      icon: BookOpen
    },
    {
      title: 'Renewals',
      desc: 'Want to keep reading? Message us before the due date. If no one has reserved the title, renewals are hassle-free.',
      icon: RefreshCw
    },
    {
      title: 'Lost Books',
      desc: 'In the rare case a book goes missing, the fair replacement price will be settled from the deposit.',
      icon: AlertCircle
    }
  ];

  return (
    <section id="rental-rules" className="py-20 border-t border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Fair & Transparent
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-100 mt-2">
            Rental Rules
          </h2>
          <p className="text-stone-400 text-sm sm:text-base font-light mt-3">
            Designed to protect the books and keep the stories circulating smoothly among readers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((rule) => {
            const Icon = rule.icon;
            return (
              <div
                key={rule.title}
                className="glass-card rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center text-accent shrink-0 mt-1">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-stone-100 mb-1.5">
                    {rule.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">
                    {rule.desc}
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
