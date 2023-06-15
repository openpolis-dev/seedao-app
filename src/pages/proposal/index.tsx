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
  const { dispatch } = useAuthContext();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [page] = useState(1);
  const [pageSize] = useState(10);
  const [proposals, setProposals] = useState<IBaseProposal[]>([]);
  const [orderType, setOrderType] = useState<'latest' | 'old'>('latest');
  const [activeTab, setActiveTab] = useState(0);

  const getCategories = async () => {
    try {
      const resp = await requests.proposal.getCategories();
      setCategories(resp.data.group.categories);
      dispatch({ type: AppActionType.SET_PROPOSAL_CATEGORIES, payload: resp.data.group.categories });
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

  useEffect(() => {
    getCategories();
  }, []);

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
            {categories.map((category) => (
              <CategoryCard key={category.id}>
                <AccordionItem uniqueKey={1} title={category.name} key={category.id}>
                  <SubCategoryCard>
                    {category.children.map((subCategory) => (
                      <SubCategoryItem key={subCategory.category_id}>
                        <SubCategoryIcon src="/images/proposal/message.png" alt="" />
                        <Link href={`/proposal/category/${subCategory.category_id}`}>{subCategory.name}</Link>
                      </SubCategoryItem>
                    ))}
                  </SubCategoryCard>
                </AccordionItem>
              </CategoryCard>
            ))}
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

const CategoryCard = styled(Accordion)`
  margin-bottom: 20px;
`;

const SubCategoryCard = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const SubCategoryItem = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SubCategoryIcon = styled.img`
  width: 24px;
  height: 24px;
`;
