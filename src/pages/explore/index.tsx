import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import React, { useState } from 'react';
import Project from 'pages/project';
import Guild from 'pages/guild';
import { useTranslation } from 'react-i18next';
import Tabbar from 'components/common/tabbar';

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
      <TitBox>
        <div className="titLft">
          <Tabbar
            tabs={[
              { key: 0, title: t('menus.Project') },
              { key: 1, title: t('menus.Guild') },
            ]}
            defaultActiveKey={0}
            onSelect={(v: string | number) => setKey(v as number)}
          />
        </div>
      </TitBox>
      {getContent()}
    </OuterBox>
  );
}

const OuterBox = styled.div`
  min-height: 100%;
  ${ContainerPadding};
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
