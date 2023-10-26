import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import React, { useMemo, useState } from 'react';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import Project from 'pages/project';
import Guild from 'pages/guild';
import { useTranslation } from 'react-i18next';

export default function ExplorePage() {
  const { t } = useTranslation();
  const [key, setKey] = useState(0);

  const getContent = () => {
    switch (key) {
      case 0:
        return <Project />;
      case 1:
        return <Guild />;
      default:
        return <></>;
    }
  };
  return (
    <OuterBox>
      <InnerBox>
        <TitBox>
          <div className="titLft">
            <Tabs defaultActiveKey={0} onSelect={(e: any) => setKey(Number(e))}>
              <Tab title={t('menus.Project')} eventKey={0} />
              <Tab title={t('menus.Guild')} eventKey={1} />
            </Tabs>
          </div>
        </TitBox>
        {getContent()}
      </InnerBox>
    </OuterBox>
  );
}

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
