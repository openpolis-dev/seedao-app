import React from 'react';
import styled from 'styled-components';
import { Button, Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SubTabbar from 'components/common/subTabbar';

interface IProps {
  onSelect(index: number): void;
}

export default function ProposalSubNav({ onSelect }: IProps) {
  const { t } = useTranslation();

  return (
    <SubNav>
      <Button
        onClick={() => {
          window.open(`https://forum.seedao.xyz/`, '_blank');
        }}
      >
        {t('Proposal.CreateProposal')}
      </Button>
      <SubTabbarBox>
        <SubTabbar
          defaultActiveKey={0}
          tabs={[
            { title: t('Proposal.TheNeweset'), key: 0 },
            { title: t('Proposal.TheOldest'), key: 1 },
          ]}
          onSelect={(v) => onSelect(v as number)}
        />
      </SubTabbarBox>
    </SubNav>
  );
}

const SubNav = styled.nav`
  display: flex;
  margin-top: 14px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubTabbarBox = styled.div`
  height: 34px;
  background-color: var(--bs-box-background);
  padding-inline: 16px;
  padding-top: 2px;
  border-radius: 8px;
`;
