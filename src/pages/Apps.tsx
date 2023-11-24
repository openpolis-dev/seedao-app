import styled from 'styled-components';
import { ContainerPadding } from '../assets/styles/global';
import React, { useMemo } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import Links from 'utils/links';
import AppCard, { EmptyAppCard } from 'components/common/appCard';
import Tabbar from 'components/common/tabbar';
import { useAuthContext } from '../providers/authProvider';

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

const RhtBoxT = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

export default function Apps() {
  const { t } = useTranslation();
  const {
    state: { theme },
  } = useAuthContext();

  const events = useMemo(() => {
    // @ts-ignore
    return Links.apps.map((item) => ({ ...item, name: t(item.name) as string, desc: t(item.desc) as string }));
  }, [t]);

  return (
    <OuterBox>
      <AppBox>
        {events.map((item, idx) => (
          <Col key={idx} sm={12} md={6} lg={4} xl={3}>
            <AppCard {...item} />
          </Col>
        ))}
        <Col sm={12} md={6} lg={4} xl={3}>
          <EmptyAppCard theme={theme} />
        </Col>
      </AppBox>
    </OuterBox>
  );
}

const AppBox = styled(Row)`
  padding-bottom: 20px;

  div[class^='col'] {
    min-height: 116px;
    display: flex;
    margin-bottom: 24px;
  }
`;
