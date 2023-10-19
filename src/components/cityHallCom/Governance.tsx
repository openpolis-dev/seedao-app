import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Calendar, Boxes } from 'react-bootstrap-icons';
import Links from 'utils/links';
import AppCard, { AppIcon } from 'components/common/appCard';

export default function GovernancePanel() {
  const { t } = useTranslation();
  return (
    <div>
      <Row>
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
      </Row>
    </div>
  );
}
