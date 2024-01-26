import React, { createContext, useContext, useState } from 'react';
import { ICategory, ITemplate } from 'type/proposalV2.type';

type ProposalContext = {
  currentStep: number;
  proposalType?: ICategory;
  template?: ITemplate;
  extraData?: { id: number; name: string };
  changeStep: (step: number) => void;
  chooseProposalType: (tp: ICategory) => void;
  chooseTemplate: (tp: ICategory | undefined, t: ITemplate, extra?: { id: number; name: string }) => void;
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
  const [proposalType, setProposalType] = useState<ICategory>();
  const [template, setTemplate] = useState<ITemplate>();
  const [extraData, setExtraData] = useState<{ id: number; name: string }>();

  const addStep = () => setCurrentStep(currentStep + 1);
  const changeStep = (newStep: number) => setCurrentStep(newStep);

  const chooseProposalType = (tp: ICategory) => {
    setProposalType(tp);
    addStep();
  };

  const chooseTemplate = (tp: ICategory | undefined, t: ITemplate, extra?: { id: number; name: string }) => {
    setProposalType(tp);
    setTemplate(t);
    setExtraData(extra);
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
        extraData,
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
