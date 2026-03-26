import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  RiskTolerance,
  InvestmentGoal,
  ExperienceLevel,
} from '@/types/finance';

interface RiskAssessmentStepProps {
  onSubmit: (data: {
    monthlyIncome: string;
    investmentAmount: string;
    riskTolerance: RiskTolerance;
    investmentGoal: InvestmentGoal;
    experienceLevel: ExperienceLevel;
  }) => void;
}

const RiskAssessmentStep = ({ onSubmit }: RiskAssessmentStepProps) => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance | ''>('');
  const [investmentGoal, setInvestmentGoal] = useState<InvestmentGoal | ''>('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | ''>('');

  const isValid =
    monthlyIncome && investmentAmount && riskTolerance && investmentGoal && experienceLevel;

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      monthlyIncome,
      investmentAmount,
      riskTolerance: riskTolerance as RiskTolerance,
      investmentGoal: investmentGoal as InvestmentGoal,
      experienceLevel: experienceLevel as ExperienceLevel,
    });
  };

  return (
    <div className="mx-auto max-w-lg px-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-display text-3xl font-bold">Risk Assessment 📊</h1>
        <p className="text-muted-foreground">Tell us about your financial profile</p>
      </div>

      <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        {/* Monthly Income */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Monthly Income ($)</Label>
          <Input
            type="number"
            placeholder="e.g. 5000"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Investment Amount */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Investment Amount ($)</Label>
          <Input
            type="number"
            placeholder="e.g. 10000"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Risk Tolerance */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Risk Tolerance</Label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as RiskTolerance[]).map((level) => (
              <button
                key={level}
                onClick={() => setRiskTolerance(level)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                  riskTolerance === level
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-secondary text-muted-foreground hover:border-primary/50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Investment Goal */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Investment Goal</Label>
          <Select value={investmentGoal} onValueChange={(v) => setInvestmentGoal(v as InvestmentGoal)}>
            <SelectTrigger className="border-border bg-secondary text-foreground">
              <SelectValue placeholder="Select a goal" />
            </SelectTrigger>
            <SelectContent className="border-border bg-card text-foreground">
              <SelectItem value="wealth-growth">Wealth Growth</SelectItem>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="passive-income">Passive Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">Experience Level</Label>
          <div className="grid grid-cols-3 gap-2">
            {(['beginner', 'intermediate', 'expert'] as ExperienceLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setExperienceLevel(level)}
                className={`rounded-lg border px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                  experienceLevel === level
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-secondary text-muted-foreground hover:border-primary/50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-xl disabled:opacity-40"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
};

export default RiskAssessmentStep;
