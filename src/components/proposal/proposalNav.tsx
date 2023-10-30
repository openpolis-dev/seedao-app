import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ArrowIconSVG from 'components/svgs/back';

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
              <ArrowIconSVG />
            </ImageBox>
          )}
          <Link to={n.to}>
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
  color: var(--bs-body-color);
  font-size: 14px;
  li:last-child {
    color: var(--bs-body-color_active);
  }
`;

const NavText = styled.span`
  cursor: pointer;
`;

const ImageBox = styled.span`
  margin-inline: 10px;

  svg {
    transform: rotate(180deg) scale(0.7);
  }
`;
