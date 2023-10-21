import React from 'react';
import styled from 'styled-components';
import { Button, Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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
      <div>
        <Tabs defaultActiveKey={0} onSelect={(e: any) => onSelect(Number(e))}>
          <Tab title={t('Proposal.TheNeweset')} eventKey={0}></Tab>
          <Tab title={t('Proposal.TheOldest')} eventKey={1}></Tab>
        </Tabs>
      </div>
    </SubNav>
  );
}

const SubNav = styled.nav`
  display: flex;
  margin-block: 20px;
  display: flex;
  justify-content: space-between;
  padding-inline: 20px;
  align-items: center;
`;
