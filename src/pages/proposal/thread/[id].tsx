import React from 'react';
import Layout from 'Layouts';
import { useRouter } from 'next/router';

export default function Proposal() {
  const router = useRouter();
  return <Layout title="SeeDAO Proposal">proposal: {router.query.id}</Layout>;
}
