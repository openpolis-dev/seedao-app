import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import requests from 'requests';
import { ICategory } from 'type/proposal.type';

export default function Index() {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const getCategories = async () => {
    try {
      const resp = await requests.proposal.getCategories();
      setCategories(resp.data.group.categories);
    } catch (error) {
      console.error('getCategories failed', error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Layout title="SeeDAO Proposal">
      <h1>proposal</h1>
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
    </Layout>
  );
}
