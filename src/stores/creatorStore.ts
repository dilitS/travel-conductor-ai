import { create } from 'zustand';
import { TripPeople } from '@/types/trip';

export interface TripDraft {
  destination: string;
  dates: { startDate: Date | null; endDate: Date | null };
  people: TripPeople | null;
  budget: 'budget' | 'moderate' | 'luxury' | null;
  interests: string[];
  notes: string;
}

interface CreatorState {
  currentStep: number;
  totalSteps: number;
  draft: TripDraft;
  
  // Actions
  setDestination: (destination: string) => void;
  setDates: (startDate: Date | null, endDate: Date | null) => void;
  setPeople: (adults: number, children: number) => void;
  setBudget: (budget: TripDraft['budget']) => void;
  toggleInterest: (interest: string) => void;
  setNotes: (notes: string) => void;
  
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const INITIAL_DRAFT: TripDraft = {
  destination: '',
  dates: { startDate: null, endDate: null },
  people: null,
  budget: null,
  interests: [],
  notes: '',
};

export const useCreatorStore = create<CreatorState>((set) => ({
  currentStep: 1,
  totalSteps: 6,
  draft: INITIAL_DRAFT,

  setDestination: (destination) => 
    set((state) => ({ draft: { ...state.draft, destination } })),
    
  setDates: (startDate, endDate) =>
    set((state) => ({ draft: { ...state.draft, dates: { startDate, endDate } } })),

  setPeople: (adults, children) =>
    set((state) => ({ draft: { ...state.draft, people: { adults, children } } })),
    
  setBudget: (budget) =>
    set((state) => ({ draft: { ...state.draft, budget } })),
    
  toggleInterest: (interest) =>
    set((state) => {
      const interests = state.draft.interests.includes(interest)
        ? state.draft.interests.filter((i) => i !== interest)
        : [...state.draft.interests, interest];
      return { draft: { ...state.draft, interests } };
    }),
    
  setNotes: (notes) =>
    set((state) => ({ draft: { ...state.draft, notes } })),

  setStep: (step) => set({ currentStep: step }),

  nextStep: () =>
    set((state) => ({ 
      currentStep: Math.min(state.currentStep + 1, state.totalSteps) 
    })),

  prevStep: () =>
    set((state) => ({ 
      currentStep: Math.max(state.currentStep - 1, 1) 
    })),

  reset: () =>
    set({ currentStep: 1, draft: INITIAL_DRAFT }),
}));

