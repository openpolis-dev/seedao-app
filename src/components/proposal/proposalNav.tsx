import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';

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
          {i !== 0 && (
            <ImageBox>
              <Image src="/images/proposal/rightArrow.svg" alt="" width="14px" height="14px" />
            </ImageBox>
          )}
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

const ImageBox = styled.span`
  margin-inline: 10px;

  img {
    position: relative;
    top: 2px !important;
  }
`;
