import React, { createContext, useContext, useState } from 'react';
import { ProposalType } from 'type/proposal.type';

type ProposalContext = {
  currentStep: number;
  proposalType?: ProposalType;
  changeStep: (step: number) => void;
  chooseProposalType: (tp: ProposalType) => void;
};

const context = createContext<ProposalContext>({
  currentStep: 1,
  changeStep: () => {},
  chooseProposalType: () => {},
});

const ProposalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [proposalType, setProposalType] = useState<ProposalType>();
  const addStep = () => setCurrentStep(currentStep + 1);
  const changeStep = (newStep: number) => setCurrentStep(newStep);

  const chooseProposalType = (tp: ProposalType) => {
    setProposalType(tp);
    addStep();
  };

  return (
    <context.Provider value={{ currentStep, proposalType, chooseProposalType, changeStep }}>
      {children}
    </context.Provider>
  );
};

export const useProposalContext = () => ({ ...useContext(context) });

export default ProposalProvider;
