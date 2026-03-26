import { TrendingUp, Zap } from 'lucide-react';
import type { InvestmentType } from '@/types/finance';

interface InvestmentTypeStepProps {
  onSelect: (type: InvestmentType) => void;
}

const InvestmentTypeStep = ({ onSelect }: InvestmentTypeStepProps) => {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="mb-10 text-center">
        <h1 className="mb-3 font-display text-4xl font-bold">
          Choose Your Investment Plan <span className="text-gradient">💰</span>
        </h1>
        <p className="text-muted-foreground">
          Select the strategy that matches your financial timeline
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <button
          onClick={() => onSelect('long-term')}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-left shadow-card transition-all duration-300 hover:border-primary/50 hover:shadow-glow"
        >
          <div className="gradient-primary mb-4 inline-flex rounded-xl p-3">
            <TrendingUp className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="mb-2 font-display text-xl font-bold text-foreground">
            Long-Term Investment
          </h2>
          <p className="text-sm text-muted-foreground">
            Build wealth over years with stable, compounding returns. Ideal for retirement and major goals.
          </p>
          <div className="mt-4 text-xs font-medium text-primary">5+ years horizon →</div>
        </button>

        <button
          onClick={() => onSelect('short-term')}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-left shadow-card transition-all duration-300 hover:border-accent/50 hover:shadow-glow"
        >
          <div className="mb-4 inline-flex rounded-xl bg-accent p-3">
            <Zap className="h-7 w-7 text-accent-foreground" />
          </div>
          <h2 className="mb-2 font-display text-xl font-bold text-foreground">
            Short-Term Investment
          </h2>
          <p className="text-sm text-muted-foreground">
            Maximize returns in a shorter window. Higher potential gains with active management.
          </p>
          <div className="mt-4 text-xs font-medium text-accent">1-3 years horizon →</div>
        </button>
      </div>
    </div>
  );
};

export default InvestmentTypeStep;
