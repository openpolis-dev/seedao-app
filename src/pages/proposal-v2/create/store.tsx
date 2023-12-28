import React, { createContext, useContext, useState } from 'react';
import { ProposalType, ProposalTemplateType } from 'type/proposal.type';

type ProposalContext = {
  currentStep: number;
  proposalType?: ProposalType;
  template?: ProposalTemplateType;
  changeStep: (step: number) => void;
  chooseProposalType: (tp: ProposalType) => void;
  chooseTemplate: (t: ProposalTemplateType) => void;
  goBackStepOne: () => void;
};

const context = createContext<ProposalContext>({
  currentStep: 1,
  changeStep: () => {},
  chooseProposalType: () => {},
  chooseTemplate: () => {},
  goBackStepOne: () => {},
});

const CreateProposalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [proposalType, setProposalType] = useState<ProposalType>();
  const [template, setTemplate] = useState<ProposalTemplateType>();

  const addStep = () => setCurrentStep(currentStep + 1);
  const changeStep = (newStep: number) => setCurrentStep(newStep);

  const chooseProposalType = (tp: ProposalType) => {
    setProposalType(tp);
    addStep();
  };

  const chooseTemplate = (t: ProposalTemplateType) => {
    setTemplate(t);
    addStep();
  };

  const goBackStepOne = () => {
    setCurrentStep(1);
    setProposalType(undefined);
    setTemplate(undefined);
  };

  return (
    <context.Provider
      value={{
        currentStep,
        proposalType,
        template,
        chooseProposalType,
        changeStep,
        chooseTemplate,
        goBackStepOne,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useProposalContext = () => ({ ...useContext(context) });

export default CreateProposalProvider;
