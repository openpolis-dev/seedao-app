import styled from 'styled-components';
import { ContainerPadding } from '../assets/styles/global';
import React, { useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import DeschoolIcon from '../assets/images/apps/deschool.png';
import AaanyIcon from '../assets/images/apps/AAAny.svg';
import Cascad3Icon from '../assets/images/apps/cascad3.svg';
import DaolinkIcon from '../assets/images/apps/daolink.svg';
import Wormhole3Icon from '../assets/images/apps/wormhole3.svg';
import MetaforoIcon from '../assets/images/apps/metaforo.png';
import { Calendar, Grid1x2 } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import Links from 'utils/links';
import SeedIcon from '../assets/images/seed.png';
import AppCard, { AppIcon } from 'components/common/appCard';

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
`;

const InnerBox = styled.div`
  background: #fff;
  padding: 20px;
  min-height: 100%;
`;

const FstTop = styled.div`
  padding-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
        <FstTop>
          <Button>{t('general.apply')}</Button>
        </FstTop>
        <Row>
          {resources.map((item, idx) => (
            <Col key={idx} sm={12} md={6} lg={4} xl={3}>
              <AppCard {...item} />
            </Col>
          ))}
          <Col sm={12} md={6} lg={4} xl={3}>
            <AppCard icon={<AppIcon src={SeedIcon} alt="" />} name="Seed" link={Links.seed} id="seed" />
          </Col>
        </Row>
      </InnerBox>
    </OuterBox>
  );
}
