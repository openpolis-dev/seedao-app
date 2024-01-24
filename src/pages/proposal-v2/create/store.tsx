import React, { createContext, useContext, useState } from 'react';
import { IBaseCategory, ITemplate } from 'type/proposalV2.type';

type ProposalContext = {
  currentStep: number;
  proposalType?: IBaseCategory;
  template?: ITemplate;
  changeStep: (step: number) => void;
  chooseProposalType: (tp: IBaseCategory) => void;
  chooseTemplate: (t: ITemplate) => void;
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
  const [proposalType, setProposalType] = useState<IBaseCategory>();
  const [template, setTemplate] = useState<ITemplate>();

  const addStep = () => setCurrentStep(currentStep + 1);
  const changeStep = (newStep: number) => setCurrentStep(newStep);

  const chooseProposalType = (tp: IBaseCategory) => {
    setProposalType(tp);
    addStep();
  };

  const chooseTemplate = (t: ITemplate) => {
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

export const useCreateProposalContext = () => ({ ...useContext(context) });

export default CreateProposalProvider;
