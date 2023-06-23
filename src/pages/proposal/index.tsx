import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from 'Layouts';
import requests from 'requests';
import { ICategory, IBaseProposal } from 'type/proposal.type';
import { Tabs, Tab } from '@paljs/ui/Tabs';
import { useAuthContext, AppActionType } from 'providers/authProvider';
import { Accordion, AccordionItem } from '@paljs/ui/Accordion';
import styled from 'styled-components';
import { Card } from '@paljs/ui/Card';
import ProposalCard from 'components/proposal/proposalCard';
import ProposalSubNav from 'components/proposal/proposalSubNav';

export default function Index() {
  const {
    state: { proposal_categories },
    dispatch,
  } = useAuthContext();
  const [page] = useState(1);
  const [pageSize] = useState(10);
  const [proposals, setProposals] = useState<IBaseProposal[]>([]);
  const [orderType, setOrderType] = useState<'latest' | 'old'>('latest');
  const [activeTab, setActiveTab] = useState(0);

  const getCategories = async () => {
    try {
      const resp = await requests.proposal.getCategories();
      dispatch({
        type: AppActionType.SET_PROPOSAL_CATEGORIES,
        payload: resp.data.group.categories.filter((category) => category.category_id === 19),
      });
    } catch (error) {
      console.error('getCategories failed', error);
    }
  };

  const getAllProposals = async () => {
    try {
      const resp = await requests.proposal.getAllProposals({ page, per_page: pageSize, sort: orderType });
      setProposals(resp.data.threads);
    } catch (error) {
      console.error('getAllProposals failed', error);
    }
  };

  const handleChangeOrder = (index: number) => {
    setOrderType(index === 0 ? 'latest' : 'old');
  };

  const handleSelectTab = (index: number) => {
    setActiveTab(index);
  };

  useEffect(() => {
    if (activeTab === 0) {
      getCategories();
    } else {
      getAllProposals();
    }
  }, [activeTab, orderType]);

  return (
    <Layout title="SeeDAO Proposal">
      <ProposalContainer>
        <Tabs activeIndex={activeTab} onSelect={handleSelectTab}>
          <Tab title="Categories" responsive></Tab>
          <Tab title="Latest" responsive></Tab>
        </Tabs>
        {activeTab === 1 && <ProposalSubNav onSelect={handleChangeOrder} />}
        {activeTab === 0 ? (
          <div>
            <SubCategoryCard>
              {proposal_categories[0].children.map((subCategory) => (
                <Link href={`/proposal/category/${subCategory.category_id}`} key={subCategory.category_id}>
                  <SubCategoryItem>
                    <SubCategoryIcon src="/images/proposal/message.png" alt="" />
                    <div>
                      <div className="name">{subCategory.name}</div>
                      <div>
                        <span>{subCategory.thread_count} topics</span>
                      </div>
                    </div>
                  </SubCategoryItem>
                </Link>
              ))}
            </SubCategoryCard>
          </div>
        ) : (
          <div>
            <ul>
              {proposals.map((proposal) => (
                <ProposalCard key={proposal.id} data={proposal} />
              ))}
            </ul>
          </div>
        )}
      </ProposalContainer>
    </Layout>
  );
}

const ProposalContainer = styled(Card)`
  min-height: 85vh;
`;

const SubCategoryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 10px;
`;

const SubCategoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
  }
  .name {
    color: #a16eff;
  }
`;

const SubCategoryIcon = styled.img`
  width: 24px;
  height: 24px;
`;
