import { useState } from 'react';
import StepIndicator from '@/components/StepIndicator';
import InvestmentTypeStep from '@/components/InvestmentTypeStep';
import RiskAssessmentStep from '@/components/RiskAssessmentStep';
import ChatInterface from '@/components/ChatInterface';
import type { UserProfile, InvestmentType } from '@/types/finance';

const Index = () => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  const handleInvestmentType = (type: InvestmentType) => {
    setProfile((prev) => ({ ...prev, investmentType: type }));
    setStep(2);
  };

  const handleRiskAssessment = (data: Omit<UserProfile, 'investmentType'>) => {
    setProfile((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleStartOver = () => {
    setProfile({});
    setStep(1);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <div className="mx-auto max-w-4xl">
        <StepIndicator currentStep={step} />

        <div className="pb-8">
          {step === 1 && <InvestmentTypeStep onSelect={handleInvestmentType} />}
          {step === 2 && <RiskAssessmentStep onSubmit={handleRiskAssessment} />}
          {step === 3 && profile.investmentType && (
            <ChatInterface profile={profile as UserProfile} onStartOver={handleStartOver} />
          )}
        </div>

        <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          ⚠️ This is not financial advice. Please consult a certified financial advisor before making investment decisions.
        </footer>
      </div>
    </div>
  );
};

export default Index;
