import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import requests from 'requests';
import { useRouter } from 'next/router';
import { IBaseProposal } from 'type/proposal.type';
import ProposalCard from 'components/proposal/proposalCard';
import ProposalNav from 'components/proposal/proposalNav';
import useProposalCategory from 'hooks/useProposalCategory';

export default function ProposalCategory() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [proposals, setProposals] = useState<IBaseProposal[]>([]);

  const ProposalNav = useProposalCategory(Number(router.query.id));

  const getProposals = async () => {
    const id = Number(router.query.id);
    if (!id) {
      return;
    }
    const res = await requests.proposal.getProposalsBySubCategory({
      page,
      per_page: pageSize,
      category_index_id: id,
      sort: 'latest',
    });
    console.log('res:', res);
    setProposals(res.data.threads);
  };

  useEffect(() => {
    router.query.id && getProposals();
  }, [router.query.id]);
  return (
    <Layout title="SeeDAO Proposal">
      {ProposalNav}
      {proposals.map((p) => (
        <ProposalCard key={p.id} data={p} />
      ))}
    </Layout>
  );
}
