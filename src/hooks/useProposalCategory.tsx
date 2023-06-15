import { useAuthContext } from 'providers/authProvider';
import React, { useEffect, useState } from 'react';
import ProposalNav, { ICatergoryNav } from 'components/proposal/proposalNav';

const HomeNav: ICatergoryNav = { name: '分类', category_id: -1, to: '/proposal' };

export default function useProposalCategory(proposal_category_id?: number) {
  const {
    state: { proposal_categories },
  } = useAuthContext();

  const [navs, setNavs] = useState<ICatergoryNav[]>([]);

  const findCategoryList = (id: number): ICatergoryNav[] => {
    const category = proposal_categories.find((category) => category.category_id === id);
    if (category) {
      return [HomeNav, { name: category.name, category_id: category.category_id, to: '/proposal' }];
    }
    for (const category of proposal_categories) {
      const subCategory = category.children.find((child) => child.category_id === id);
      if (subCategory) {
        return [
          HomeNav,
          { name: category.name, category_id: category.category_id, to: '/proposal' },
          {
            name: subCategory.name,
            category_id: subCategory.category_id,
            to: `/proposal/category/${subCategory.category_id}`,
          },
        ];
      }
    }
    return [];
  };
  console.log('proposal_category_id', proposal_category_id);
  console.log('proposal_categories', proposal_categories);

  useEffect(() => {
    if (!proposal_category_id || !proposal_categories.length) return;
    setNavs(findCategoryList(proposal_category_id));
  }, [proposal_category_id, proposal_categories]);

  return <ProposalNav navs={navs} />;
}
