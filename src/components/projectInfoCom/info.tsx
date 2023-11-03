import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ReTurnProject } from 'type/project.type';
import Members from './members';
import ReactMarkdown from 'react-markdown';
import { Button } from 'react-bootstrap';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';

interface Iprops {
  detail: ReTurnProject | undefined;
  onUpdate: () => void;
  handleEdit: () => void;
}
export default function Info({ detail, onUpdate, handleEdit }: Iprops) {
  const { t } = useTranslation();
  const canAuditApplication = usePermission(
    PermissionAction.CreateApplication,
    PermissionObject.ProjPrefix + detail?.id,
  );

  return (
    <>
      {/*{show && <CloseTips closeModal={closeModal} handleClosePro={handleClosePro} />}*/}
      {/*{showSuccess && <CloseSuccess closeModal={closeSuccess} />}*/}

      <FlexLine>
        <AllBox>
          <TopBox>
            <TopImg>
              <img src={detail?.logo} alt="" />
            </TopImg>
            <TopInfo>
              <TitleBox>{detail?.name}</TitleBox>
              <div className="desc">{detail?.desc}</div>
              <ProposalBox>
                {detail?.proposals.map((item, index) => (
                  <li key={index}>
                    <a href={item} target="_blank" rel="noopener noreferrer">
                      {`SIP-${index + 1}`}
                    </a>
                  </li>
                ))}
              </ProposalBox>
            </TopInfo>
          </TopBox>
          <LastLine>
            <LftBox>
              <Members detail={detail} updateProject={onUpdate} />
            </LftBox>

            <ContentBox>
              <ReactMarkdown>{detail?.intro || ''}</ReactMarkdown>
            </ContentBox>
          </LastLine>
        </AllBox>
        {/*<div>*/}

        {canAuditApplication && <Button onClick={() => handleEdit()}>{t('Project.Edit')}</Button>}
        {/*<TextButton onClick={() => handleShow()}>Close project</TextButton>*/}
        {/*</div>*/}
      </FlexLine>
    </>
  );
}

const AllBox = styled.div`
  flex-grow: 1;
  margin-right: 18px;
`;

const FlexLine = styled.div`
  display: flex;
  align-items: flex-start;
`;

const LastLine = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin-top: 60px;
  flex-shrink: 0;
`;

const LftBox = styled.div`
  background: var(--bs-box--background);
  width: 246px;
  border-radius: 16px;
  box-sizing: border-box;
  padding: 24px;
`;

const TopBox = styled.div`
  display: flex;
  margin-top: 46px;
`;

const TopImg = styled.div`
  margin-right: 18px;
  img {
    width: 110px;
    height: 110px;
    border-radius: 16px;
  }
`;

const TitleBox = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--bs-body-color_active);
  line-height: 36px;
`;

const TopInfo = styled.div`
  flex-grow: 1;
  margin: 8px auto;
  .desc {
    width: 630px;

    font-size: 12px;
    font-weight: 400;
    color: #b0b0b0;
    line-height: 18px;
  }
`;

const ProposalBox = styled.ul`
  display: flex;
  align-items: center;
  margin-top: 14px;
  flex-wrap: wrap;
  li {
    border-radius: 5px;
    border: 1px solid #0085ff;
    font-size: 12px;
    margin-right: 12px;
    a {
      padding: 2px 12px;
      color: #0085ff;
    }
  }
`;

const ContentBox = styled.div`
  border-radius: 16px;
  background: var(--bs-box--background);
  padding: 24px;
  flex-grow: 1;
  margin-left: 16px;
  color: var(--bs-body-color_active);

  img {
    max-width: 100%;
  }
`;
