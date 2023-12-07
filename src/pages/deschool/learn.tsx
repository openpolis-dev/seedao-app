import { useTranslation } from 'react-i18next';
import { Learn } from '@deschool-protocol/react';
import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';

export default function LearnCourse() {
  const { t } = useTranslation();
  return (
    <Page>
      <BackerNav to="/home" title={t('general.back')} />
      <Learn topicId={'62f0adc68b90ee1aa913a965'}></Learn>
    </Page>
  );
}

const Page = styled.div`
  ${ContainerPadding}
`;
