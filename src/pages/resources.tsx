import styled from 'styled-components';
import { ContainerPadding } from '../assets/styles/global';
import { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';

import { useTranslation } from 'react-i18next';
import Links from 'utils/links';
import SeedIcon from '../assets/images/seed.png';
import AppCard, { AppIcon, EmptyAppCard } from 'components/common/appCard';
import Tabbar from 'components/common/tabbar';

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const InnerBox = styled.div`
  background: #fff;
  padding: 20px;
  min-height: 100%;
`;

const TitBox = styled.div`
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .titLft {
    width: 100%;
  }
`;

const AppBox = styled(Row)`
  padding: 20px;
`;

export default function Resources() {
  const { t } = useTranslation();

  const resources = useMemo(() => {
    // @ts-ignore
    return Links.resource.map((item) => ({ ...item, name: t(item.name) as string }));
  }, [t]);

  return (
    <OuterBox>
      <InnerBox>
        <TitBox>
          <div className="titLft">
            <Tabbar defaultActiveKey={0} tabs={[{ key: 0, title: t('resources.all') }]} />
          </div>
        </TitBox>

        <AppBox>
          {resources.map((item, idx) => (
            <Col key={idx} sm={12} md={6} lg={4} xl={3}>
              <AppCard {...item} />
            </Col>
          ))}
          <Col sm={12} md={6} lg={4} xl={3}>
            <AppCard icon={SeedIcon} desc="" name="Seed" link={Links.seed} id="seed" />
          </Col>
          <Col sm={12} md={6} lg={4} xl={3}>
            <EmptyAppCard />
          </Col>
        </AppBox>
      </InnerBox>
    </OuterBox>
  );
}
