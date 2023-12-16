import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import LearnCourse from 'components/newcomer/learn';
import { useTranslation } from 'react-i18next';

export default function Newcomer() {
  const { t } = useTranslation();
  return (
    <Page>
      <LearnBox>
        <BoxTitle>
          <div>{t('Onboarding.CourseTitle')}</div>
        </BoxTitle>
        <LearnCourse />
      </LearnBox>
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding}
  min-height: 100%;
`;

const BoxTitle = styled.div`
  font-size: 24px;
  font-family: Poppins-SemiBold;

  div {
    padding-top: 20px;
    padding-left: 32px;
  }
`;

const LearnBox = styled.div`
  background-color: var(--bs-box--background);
  border-radius: 16px;
  min-height: 100%;
`;
