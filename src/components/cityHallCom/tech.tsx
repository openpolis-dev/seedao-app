import styled from 'styled-components';
import { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Links from 'utils/links';
import AppCard, { EmptyAppCard } from 'components/common/appCard';
import { useAuthContext } from '../../providers/authProvider';

const AppBox = styled(Row)`
  div[class^='col'] {
    min-height: 96px;
    display: flex;
    margin-bottom: 24px;
  }
  .boxApp {
    align-items: flex-start;
    padding: 16px;
  }
  .iconBox {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    .inner {
      background: var(--home-right);
      width: 44px;
      height: 44px;
      border-radius: 8px;
    }
    img {
      width: 24px;
      height: 24px;
      border-radius: 8px;
    }
  }
`;

export default function TechPanel() {
  const { t } = useTranslation();

  const {
    state: { theme },
  } = useAuthContext();

  const lst = useMemo(() => {
    // @ts-ignore
    return Links.tech.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string }));
  }, [t]);
  return (
    <div>
      <AppBox>
        {lst.map((app, i) => (
          <Col sm={12} md={6} lg={4} xl={3} key={i}>
            <AppCard {...app} />
          </Col>
        ))}
        <Col sm={12} md={6} lg={4} xl={3}>
          <EmptyAppCard theme={theme} />
        </Col>
      </AppBox>
    </div>
  );
}
