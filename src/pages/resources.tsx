import styled from 'styled-components';
import { ContainerPadding } from '../assets/styles/global';
import { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';

import { useTranslation } from 'react-i18next';
import Links from 'utils/links';

import AppCard, { EmptyAppCard } from 'components/common/appCard';
import Tabbar from 'components/common/tabbar';

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const TitBox = styled.div`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  color: var(--bs-body-color_active);
  .titLft {
    width: 100%;
  }
`;

const AppBox = styled(Row)`
  padding: 20px 0;
`;

export default function Resources() {
  const { t } = useTranslation();

  const resources = useMemo(() => {
    // @ts-ignore
    return Links.resource.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string }));
  }, [t]);

  return (
    <OuterBox>
      <TitBox>
        {/*<div className="titLft">*/}
        {/*  <Tabbar defaultActiveKey={0} tabs={[{ key: 0, title: t('resources.all') }]} />*/}
        {/*</div>*/}
        {t('resources.all')}
      </TitBox>

      <AppBox>
        {resources.map((item, idx) => (
          <Col key={idx} sm={12} md={6} lg={4} xl={3}>
            <AppCard {...item} />
          </Col>
        ))}
        <Col sm={12} md={6} lg={4} xl={3}>
          <EmptyAppCard />
        </Col>
      </AppBox>
    </OuterBox>
  );
}
