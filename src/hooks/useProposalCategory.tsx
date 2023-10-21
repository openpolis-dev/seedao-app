import { useAuthContext } from 'providers/authProvider';
import React, { useEffect, useMemo, useState } from 'react';
import ProposalNav, { ICatergoryNav } from 'components/proposal/proposalNav';
import { useTranslation } from 'react-i18next';

export default function useProposalCategory(proposal_category_id?: number) {
  const { t } = useTranslation();
  const {
    state: { proposal_categories },
  } = useAuthContext();

  const [navs, setNavs] = useState<ICatergoryNav[]>([]);

  const HomeNav: ICatergoryNav = useMemo(() => {
    return { name: t('Proposal.AllCategories'), category_id: -1, to: '/proposal' };
  }, [t]);

  const findCategoryList = (id: number): ICatergoryNav[] => {
    const category = proposal_categories.find((category) => category.category_id === id);
    if (category) {
      return [
        HomeNav,
        { name: category.name, category_id: category.category_id, to: `/proposal/category/${category.category_id}` },
      ];
    }
    for (const category of proposal_categories) {
      const subCategory = category.children.find((child) => child.category_id === id);
      if (subCategory) {
        return [
          HomeNav,
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

  useEffect(() => {
    if (!proposal_category_id || !proposal_categories.length) return;
    setNavs(findCategoryList(proposal_category_id));
  }, [proposal_category_id, proposal_categories, t]);

  return <ProposalNav navs={navs} />;
}
