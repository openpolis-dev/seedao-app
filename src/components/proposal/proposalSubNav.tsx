import React from 'react';
import styled from 'styled-components';
import { Button } from '@paljs/ui';
import { Tabs, Tab } from '@paljs/ui/Tabs';

interface IProps {
  onSelect(index: number): void;
}

export default function ProposalSubNav({ onSelect }: IProps) {
  return (
    <SubNav>
      <Button
        size="Small"
        onClick={() => {
          window.open(`https://forum.seedao.xyz/`, '_blank');
        }}
      >
        Create Proposal
      </Button>
      <div>
        <Tabs activeIndex={0} onSelect={onSelect}>
          <Tab title="Latest" responsive></Tab>
          <Tab title="Oldest" responsive></Tab>
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
`;
