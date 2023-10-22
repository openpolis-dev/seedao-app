import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ReTurnProject } from 'type/project.type';

interface Iprops {
  detail: ReTurnProject | undefined;
}
export default function Info({ detail }: Iprops) {
  const { t } = useTranslation();
  return (
    <>
      <TopBox>
        <TopImg>
          <img src={detail?.logo} alt="" />
        </TopImg>
        <TopInfo>
          <ProposalBox>
            {detail?.proposals.map((item, index) => (
              <li key={index}>
                <a href={item} target="_blank" rel="noopener noreferrer">
                  {`关联提案${index + 1}`}
                </a>
              </li>
            ))}
          </ProposalBox>
          <div className="desc">
            this is description this is description this is description this is description this is description this is
            description this is description this is description this is description this is description
          </div>
        </TopInfo>
      </TopBox>
    </>
  );
}

const TopBox = styled.div`
  display: flex;
  gap: 40px;
`;

const TopImg = styled.div`
  img {
    width: 300px;
  }
`;

const TopInfo = styled.div``;

const ProposalBox = styled.ul`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  li {
    border-radius: 5px;
    border: 1px solid #ccc;
    a {
      padding: 5px 10px;
    }
  }
`;
