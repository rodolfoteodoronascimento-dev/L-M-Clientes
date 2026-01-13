
import { OnboardingStatus } from './types';

export const STATUS_COLORS: Record<OnboardingStatus, string> = {
    [OnboardingStatus.Prospect]: 'bg-sky-500/10 text-sky-400',
    [OnboardingStatus.Onboarding]: 'bg-blue-500/10 text-blue-400',
    [OnboardingStatus.SetupComplete]: 'bg-indigo-500/10 text-indigo-400',
    [OnboardingStatus.Active]: 'bg-green-500/10 text-green-400',
    [OnboardingStatus.Churned]: 'bg-red-500/10 text-red-400',
};

export const ACCOUNTING_RESPONSIBLES = [
    'Mariana Lima',
    'Lucas Mendes',
    'Sofia Ribeiro',
    'João Santos',
    'Ana Pereira',
    'Carlos Andrade',
];