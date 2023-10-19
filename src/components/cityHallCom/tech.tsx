import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { EmptyAppCard } from 'components/common/appCard';

const AppBox = styled(Row)`
  padding-inline: 20px;
  padding-top: 10px;
`;

export default function TechPanel() {
  const { t } = useTranslation();
  return (
    <div>
      <AppBox>
        <Col sm={12} md={6} lg={4} xl={3}>
          <EmptyAppCard />
        </Col>
      </AppBox>
    </div>
  );
}
