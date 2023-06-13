import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from 'Layouts';
import requests from 'requests';
import { ICategory, IBaseProposal } from 'type/proposal.type';
import { Tabs, Tab } from '@paljs/ui/Tabs';
import { useRouter } from 'next/router';

export default function Index() {
  const { locale } = useRouter();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [page] = useState(1);
  const [pageSize] = useState(10);
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
            <div key={category.id}>
              <h2>{category.name}</h2>
              <ul>
                {category.children.map((subCategory) => (
                  <li key={subCategory.name}>{subCategory.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </Tab>
        <Tab title="Latest" responsive>
          <ul>
            {proposals.map((prop) => (
              <li key={prop.id}>
                <Link href={`${locale}/proposal/${prop.id}`}>{prop.title}</Link>
              </li>
            ))}
          </ul>
        </Tab>
      </Tabs>
    </Layout>
  );
}
