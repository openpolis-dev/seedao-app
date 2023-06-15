import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

export interface ICatergoryNav {
  name: string;
  to: string;
  category_id: number;
}

export default function ProposalNav({ navs }: { navs: ICatergoryNav[] }) {
  return (
    <Nav>
      {navs.map((n, i) => (
        <li key={n.category_id}>
          {i !== 0 && <Arrow>{`>`}</Arrow>}
          <Link href={n.to}>
            <NavText>{n.name}</NavText>
          </Link>
        </li>
      ))}
    </Nav>
  );
}

const Nav = styled.ul`
  display: flex;
  font-weight: 600;
  margin-bottom: 20px;
`;

const Arrow = styled.span`
  margin-inline: 10px;
`;

const NavText = styled.span`
  cursor: pointer;
`;
