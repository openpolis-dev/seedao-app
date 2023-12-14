import { useTranslation } from 'react-i18next';
import { Learn } from '@deschool-protocol/react';
import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import { useCourse } from '@deschool-protocol/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TOPIC_ID = '62f0adc68b90ee1aa913a965';

export default function LearnCourse() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { allFinished } = useCourse();

  useEffect(() => {
    if (allFinished) {
      navigate('/onboarding/done');
    }
  }, [allFinished]);

  return (
    <Page>
      <BackerNav to="/home" title={t('general.back')} />
      <Learn topicId={TOPIC_ID}></Learn>
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding}
`;
