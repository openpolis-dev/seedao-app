import styled from 'styled-components';
import { ContainerPadding } from 'assets/styles/global';
import React, { useEffect, useState } from 'react';
import Project from 'pages/project';
import Guild from 'pages/guild';
import { useTranslation } from 'react-i18next';
import Tabbar from 'components/common/tabbar';
import { useSearchParams } from 'react-router-dom';

export default function ExplorePage() {
  const [search] = useSearchParams();
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

  useEffect(() => {
    const query_tab = search.get('tab');
    if (query_tab === 'guild') {
      setKey(1);
    } else {
      setKey(0);
    }
  }, [search]);

  return (
    <OuterBox>
      <TitBox>
        <div className="titLft">
          <Tabbar
            tabs={[
              { key: 0, title: t('menus.Project') },
              { key: 1, title: t('menus.Guild') },
            ]}
            defaultActiveKey={key}
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
