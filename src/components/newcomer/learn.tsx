import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import CloseIcon from 'assets/Imgs/close.svg';
import { useState } from 'react';
import LearnCourse from './course';

const QUESTIONS = [
  {
    q: 'Onboarding.QuestionOne',
    a: 'Onboarding.AnswerOne',
  },
  {
    q: 'Onboarding.QuestionTwo',
    a: 'Onboarding.AnswerTwo',
  },
];

export default function LearnDashboard() {
  const { t } = useTranslation();
  const [showAnswerContent, setShowAnswerContent] = useState('');
  const [showCourse, setShowCourse] = useState(false);

  const go2learn = () => {
    setShowCourse(true);
  };

  return (
    <LeanDashboardStyle>
      <LearnDashboardContet>
        <DashboardLeft>
          <div className="title">{t('Onboarding.ContributeCamp')}</div>
          <div className="desc">{t('Onboarding.ContributeCampIntro')}</div>
          {QUESTIONS.map((item, index) => (
            <div className="question" key={index} onClick={() => setShowAnswerContent(t(item.a as any))}>
              {t(item.q as any)}
            </div>
          ))}
        </DashboardLeft>
        <DashboardRight>
          <ModuleLinkButton onClick={go2learn}>{t('Onboarding.Enroll')}</ModuleLinkButton>
          <LinkButton href="" rel="noreferrer">
            {t('Onboarding.NewcomerReward')}
          </LinkButton>
          <LinkButton href="" rel="noreferrer">
            {t('Onboarding.JoinCommunity')}
          </LinkButton>
          <ModuleLinkButton onClick={go2learn}>{t('Onboarding.FinalExamination')}</ModuleLinkButton>
        </DashboardRight>
      </LearnDashboardContet>
      {showAnswerContent && (
        <AnswerBox>
          <div className="content">{showAnswerContent}</div>
          <img src={CloseIcon} alt="" onClick={() => setShowAnswerContent('')} />
        </AnswerBox>
      )}
      {showCourse && (
        <CourseBox>
          <LearnCourse />
          <img src={CloseIcon} alt="" onClick={() => setShowCourse(false)} />
        </CourseBox>
      )}
    </LeanDashboardStyle>
  );
}

const LeanDashboardStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const LearnDashboardContet = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const DashboardLeft = styled.div`
  .title {
    font-size: 26px;
    margin-bottom: 16px;
  }
  .question {
    cursor: pointer;
    border: 1px solid var(--bs-border-color);
    border-radius: 8px;
    margin-block: 10px;
    background-color: var(--bs-box--background);
    padding: 10px 16px;
  }
`;

const DashboardRight = styled.div``;

const AnswerBox = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--bs-box--background);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-inline: 30px;
  img {
    cursor: pointer;
    width: 30px;
    margin-top: 20px;
  }
`;

const BasicButton = css`
  padding-inline: 10px 16px;
  border: 1px solid var(--bs-border-color);
  border-radius: 8px;
  margin-block: 10px;
  background-color: var(--bs-box--background);
  padding: 10px 16px;
`;

const LinkButton = styled.a`
  ${BasicButton};
  display: block;
`;

const ModuleLinkButton = styled.div`
  ${BasicButton};
  cursor: pointer;
`;

const CourseBox = styled.div`
  width: 150%;
  height: 100%;
  position: absolute;
  top: 0;
  left: -25%;
  background-color: var(--bs-box--background);
  padding-top: 30px;
  border-radius: 16px;
  img {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
  }
`;
