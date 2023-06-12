import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import requests from 'requests';
import { ICategory, IBaseProposal } from 'type/proposal.type';
import { Tabs, Tab } from '@paljs/ui/Tabs';

export default function Index() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [proposals, setProposals] = useState<IBaseProposal[]>([]);

  const getCategories = async () => {
    try {
      const resp = await requests.proposal.getCategories();
      setCategories(resp.data.group.categories);
    } catch (error) {
      console.error('getCategories failed', error);
    }
  };

  const getAllProposals = async () => {
    try {
      const resp = await requests.proposal.getAllProposals({ page, per_page: pageSize, sort: 'latest' });
      setProposals(resp.data.threads);
    } catch (error) {
      console.error('getAllProposals failed', error);
    }
  };

  useEffect(() => {
    getAllProposals();
  }, []);

  const handleSelectTab = (index: number) => {
    if (index === 0) {
      getCategories();
    } else {
      getAllProposals();
    }
  };

  return (
    <Layout title="SeeDAO Proposal">
      <Tabs activeIndex={0} fullWidth onSelect={handleSelectTab}>
        <Tab title="Categories" responsive>
          {categories.map((category) => (
            <div>
              <h2>{category.name}</h2>
              <ul key={category.id}>
                {category.children.map((subCategory) => (
                  <li key={subCategory.id}>{subCategory.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </Tab>
        <Tab title="Latest" responsive>
          <ul>
            {proposals.map((prop) => (
              <li key={prop.id}>{prop.title}</li>
            ))}
          </ul>
        </Tab>
      </Tabs>
    </Layout>
  );
}
