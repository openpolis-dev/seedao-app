import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Calendar, Boxes } from 'react-bootstrap-icons';
import Links from 'utils/links';

export default function GovernancePanel() {
  const { t } = useTranslation();
  return (
    <div>
      <Row>
        <Col sm={12} md={6} lg={4} xl={3}>
          <AppCardStyle href={Links.calendarReviewLink} target="_blank">
            <div className="iconBox">
              <Calendar />
            </div>
            <div>{t('city-hall.CalendarReview')}</div>
          </AppCardStyle>
        </Col>
        <Col sm={12} md={6} lg={4} xl={3}>
          <AppCardStyle href={Links.appReviewLink} target="_blank">
            <div className="iconBox">
              <Boxes />
            </div>
            <div>{t('city-hall.AppReview')}</div>
          </AppCardStyle>
        </Col>
      </Row>
    </div>
  );
}

const AppCardStyle = styled.a`
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  background-size: 100%;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding-block: 30px;
  background-color: #fff;
  margin-bottom: 20px;
  .iconBox {
    font-size: 24px;
  }

  @media (max-width: 1024px) {
    padding-block: 20px;
    gap: 5px;
    font-size: 14px;
    .iconBox {
      font-size: 20px;
    }
  }
`;
