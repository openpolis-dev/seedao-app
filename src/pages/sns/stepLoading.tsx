import styled from 'styled-components';
import { useSNSContext } from './snsProvider';
import { useTranslation } from 'react-i18next';
import DoneIcon from 'assets/Imgs/sns/done.svg';

const Loading = () => {
  return (
    <LoadingBox className="spinner">
      <div className="spinner-item"></div>
      <div className="spinner-item"></div>
      <div className="spinner-item"></div>
    </LoadingBox>
  );
};

const STEPS = [
  {
    step: 1,
    value: 1,
    intro: 'SNS.Step1Intro',
  },
  {
    step: 2,
    value: 1.5,
    intro: 'SNS.StepMiddleIntro',
  },
  {
    step: 3,
    value: 2,
    intro: 'SNS.Step2Intro',
  },
];

export default function StepLoading() {
  const {
    state: { step },
  } = useSNSContext();
  const { t } = useTranslation();
  return (
    <Mask>
      <LoadingContainer>
        <div className="title">{t('SNS.StepLoadingTitle')}</div>
        <div className="step-container">
          {STEPS.map((item) => (
            <StepBox className={step >= item.value ? 'active' : ''} key={item.value}>
              {step > item.value ? <img src={DoneIcon} alt="" /> : <div className="step">{item.step}</div>}
              <div className="loader">{step === item.value && <Loading />}</div>

              {/* @ts-ignore */}
              <div className="intro">{t(item.intro as string)}</div>
            </StepBox>
          ))}
        </div>
      </LoadingContainer>
    </Mask>
  );
}

const Mask = styled.div`
  background: rgba(13, 12, 15, 0.9);
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const LoadingContainer = styled.div`
  text-align: center;
  .title {
    font-family: 'Poppins-Medium';
    line-height: 28px;
    font-size: 24px;
    margin-bottom: 44px;
  }
  .step-container {
    display: flex;
    gap: 60px;
  }
`;

const StepBox = styled.div`
  width: 220px;
  height: 180px;
  border-radius: 16px;
  background: #fff;
  color: #1a1323;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding-inline: 20px;
  img {
    width: 32px;
  }
  .loader {
    height: 34px;
  }
  &.active {
    background: var(--bs-primary);
    color: #fff;
  }
  .step {
    font-family: 'Poppins-Medium';
    font-size: 24px;
    line-height: 28px;
  }
  .intro {
    font-size: 14px;
    line-height: 22px;
  }
`;

const LoadingBox = styled.div`
  --animation-duration: 1150ms;

  .spinner-item {
    --item-size: 6px;
    width: var(--item-size);
    height: var(--item-size);
    display: inline-block;
    margin: 0 3px;
    border-radius: 50%;
    border: 4px solid var(--clr-spinner);
    animation: spinner4 var(--animation-duration) ease-in-out infinite;
    background-color: #fff;

    @keyframes spinner4 {
      0%,
      100% {
        transform: translateY(75%);
      }

      50% {
        transform: translateY(-75%);
      }
    }
  }

  .spinner-item:nth-child(1) {
    --clr-spinner: var(--clr5);
    animation-delay: calc(var(--animation-duration) / 6 * -1);
  }

  .spinner-item:nth-child(2) {
    --clr-spinner: var(--clr3);
    animation-delay: calc(var(--animation-duration) / 6 * -2);
  }

  .spinner-item:nth-child(3) {
    --clr-spinner: var(--clr1);
    animation-delay: calc(var(--animation-duration) / 6 * -3);
  }
`;
