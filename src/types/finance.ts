export type InvestmentType = 'long-term' | 'short-term';
export type RiskTolerance = 'low' | 'medium' | 'high';
export type InvestmentGoal = 'wealth-growth' | 'savings' | 'passive-income';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'expert';

export interface UserProfile {
  investmentType: InvestmentType;
  monthlyIncome: string;
  investmentAmount: string;
  riskTolerance: RiskTolerance;
  investmentGoal: InvestmentGoal;
  experienceLevel: ExperienceLevel;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const riskLabel: Record<RiskTolerance, string> = {
  low: 'Conservative',
  medium: 'Moderate',
  high: 'Aggressive',
};

export const goalLabel: Record<InvestmentGoal, string> = {
  'wealth-growth': 'Wealth Growth',
  'savings': 'Savings',
  'passive-income': 'Passive Income',
};
