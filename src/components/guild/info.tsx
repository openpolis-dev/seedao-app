import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ReTurnProject } from 'type/project.type';
import Members from './members';
import ReactMarkdown from 'react-markdown';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';
import { Button } from 'react-bootstrap';

interface Iprops {
  detail: ReTurnProject | undefined;
  onUpdate: () => void;
  handleEdit: () => void;
}
export default function Info({ detail, onUpdate, handleEdit }: Iprops) {
  const { t } = useTranslation();
  const canAuditApplication = usePermission(
    PermissionAction.CreateApplication,
    PermissionObject.GuildPrefix + detail?.id,
  );

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
                  {`SIP-${index + 1}`}
                </a>
              </li>
            ))}
          </ProposalBox>
          <div className="desc">{detail?.desc}</div>
        </TopInfo>
        {canAuditApplication && (
          <div>
            <Button onClick={() => handleEdit()}>{t('general.edit')}</Button>
          </div>
        )}
      </TopBox>
      <Members detail={detail} updateProject={onUpdate} />
      <ContentBox>
        <div>{t('Guild.Intro')}</div>
        <ReactMarkdown>{detail?.intro || ''}</ReactMarkdown>
      </ContentBox>
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

const ContentBox = styled.div`
  line-height: 1.2em;
  padding-top: 40px;
  border-top: 1px solid #eee;
  margin-top: 20px;
  h2 {
    padding: 1rem 0;
  }
  p {
    padding: 0 -0px 1rem;
  }
  img {
    max-width: 100%;
  }
`;
