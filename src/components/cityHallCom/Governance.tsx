import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Calendar, Boxes } from 'react-bootstrap-icons';
import Links from 'utils/links';
import AppCard, { EmptyAppCard } from 'components/common/appCard';

const AppBox = styled(Row)`
  padding-inline: 20px;
  padding-top: 10px;
`;

export default function GovernancePanel() {
  const { t } = useTranslation();
  return (
    <div>
      <AppBox>
        <Col sm={12} md={6} lg={4} xl={3}>
          <AppCard
            id="calendar"
            link={Links.calendarReviewLink}
            icon={<Calendar />}
            name={t('city-hall.CalendarReview')}
          />
        </Col>
        <Col sm={12} md={6} lg={4} xl={3}>
          <AppCard id="calendar" link={Links.appReviewLink} icon={<Boxes />} name={t('city-hall.AppReview')} />
        </Col>
        <Col sm={12} md={6} lg={4} xl={3}>
          <EmptyAppCard />
        </Col>
      </AppBox>
    </div>
  );
}
