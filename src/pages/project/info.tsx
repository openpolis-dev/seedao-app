import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getProjectById } from 'requests/project';
import { ProjectStatus, ReTurnProject } from 'type/project.type';
import { AppActionType, useAuthContext } from 'providers/authProvider';
import { ContainerPadding } from 'assets/styles/global';
import BackerNav from 'components/common/backNav';
import usePermission from 'hooks/usePermission';
import { PermissionObject, PermissionAction } from 'utils/constant';
import { useTranslation } from 'react-i18next';
import Members from 'components/projectInfoCom/members';
import SipTag from 'components/common/sipTag';
import { MdPreview } from 'md-editor-rt';
import DefaultLogo from 'assets/Imgs/defaultLogo.png';
import { ethers } from 'ethers';
import { getUsers } from '../../requests/user';
import useQuerySNS from '../../hooks/useQuerySNS';
import { IUser } from '../../type/user.type';
import publicJs from '../../utils/publicJs';
import CategoryTag from 'components/proposalCom/categoryTag';

type UserMap = { [w: string]: IUser };
export default function InfoPage() {
  const { t } = useTranslation();

  const {
    state: { theme },
    dispatch,
  } = useAuthContext();

  const { id } = useParams();
  const { getMultiSNS } = useQuerySNS();
  const [detail, setDetail] = useState<any>();
  const [snsMap, setSnsMap] = useState<any>({});
  const [userMap, setUserMap] = useState<UserMap>({});
  const [sponserList, setSponserList] = useState<any[]>([]);

  const canAuditApplication = usePermission(
    PermissionAction.CreateApplication,
    PermissionObject.ProjPrefix + detail?.id,
  );

  useEffect(() => {
    id && getDetail();
  }, [id]);

  const getUsersDetail = async (dt: any) => {
    const _wallets: string[] = [];

    dt?.forEach((w: any) => {
      if (ethers.utils.isAddress(w)) {
        _wallets.push(w);
      }
    });
    const wallets = Array.from(new Set(_wallets));
    let userSns = await getMultiSNS(wallets);
    setSnsMap(userSns);
    getUsersInfo(wallets);
  };

  const getUsersInfo = async (wallets: string[]) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const res = await getUsers(wallets);
      const userData: UserMap = {};
      res.data?.forEach((r) => {
        userData[(r.wallet || '').toLowerCase()] = r;
      });
      setUserMap(userData);

      let arr: any[] = [];

      detail.sponsors.map((item: any) => {
        let itemInfo = userData[item];
        let itemSns = snsMap.get(item);
        arr.push({
          ...itemInfo,
          sns: itemSns,
        });
      });

      setSponserList([...arr]);
    } catch (error) {
      logError('getUsersInfo error:', error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const getDetail = async () => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const dt = await getProjectById(id as string);
      setDetail(dt.data);

      await getUsersDetail(dt.data.sponsors);
    } catch (error) {
      logError(error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: null });
    }
  };

  const onUpdate = () => {
    getDetail();
  };

  const showStatusComponent = () => {
    if (detail?.status === ProjectStatus.Closed) {
      return <StatusTag>{t('Project.Closed')}</StatusTag>;
    }
    if (detail?.status === ProjectStatus.Pending) {
      return <StatusTag>{t('Project.Pending')}</StatusTag>;
    }
    // if (canAuditApplication) {
    //   return (
    //     <Link to={`/project/edit/${detail?.id}`} state={detail}>
    //       <Button>{t('Project.Edit')}</Button>
    //     </Link>
    //   );
    // }
  };

  return (
    <OuterBox>
      <Box>
        <BackerNav title={detail?.name || ''} to="/explore?tab=project" mb="40px" />
        <Content>
          <FlexLine>
            <AllBox>
              <TopBox>
                <TopBoxLeft>
                  <TopImg>
                    <img src={detail?.logo || DefaultLogo} alt="" />
                  </TopImg>
                  <TopInfo>
                    <TitleBox>{detail?.name}</TitleBox>
                    {/*<div className="desc">{detail?.desc}</div>*/}
                    <FlexFirst>
                      <ProposalBox>
                        {detail?.proposals?.map((item: any, index: number) => (
                          <SipTag key={index} slug={item} />
                        ))}
                      </ProposalBox>
                      {detail?.Category && <CategoryTag>{detail?.Category}</CategoryTag>}
                      <StatusBox className={detail?.status}>{detail?.status}</StatusBox>
                    </FlexFirst>
                  </TopInfo>
                </TopBoxLeft>

                {showStatusComponent()}
              </TopBox>
              <LastLine>
                {/*<LftBox>*/}
                {/*  <InnerLft>*/}
                {/*    <Members detail={detail} updateProject={onUpdate} />*/}
                {/*  </InnerLft>*/}
                {/*</LftBox>*/}
                <ContentBox>
                  {canAuditApplication && (
                    <BtnTop to={`/project/edit/${detail?.id}`} state={detail}>
                      <Button>{t('Project.Edit')}</Button>
                    </BtnTop>
                  )}

                  {/*<TitleBox>{t('Project.ProjectIntro')}</TitleBox>*/}
                  <DlBox>
                    <dl>
                      <dt>{t('Project.ProjectIntro')}</dt>
                      <dd>{detail?.intro}</dd>
                    </dl>
                    <dl>
                      <dt>{t('Project.StartProjectLink')}</dt>
                      <dd>{detail?.ApprovalLink}</dd>
                    </dl>
                    <dl>
                      <dt>{t('Project.EndProjectLink')}</dt>
                      <dd>{detail?.OverLink}</dd>
                    </dl>
                    <dl>
                      <dt>{t('Project.Moderator')}</dt>
                      <dd>
                        {sponserList.map((item: any, index: number) => (
                          <MemBox key={`avatar_${index}`}>
                            <Avatar>
                              <img src={item?.avatar} alt="" />
                            </Avatar>
                            <span>
                              {item?.sns?.endsWith('.seedao') ? item.sns : publicJs.AddressToShow(item?.sns?.wallet)}
                            </span>
                          </MemBox>
                        ))}
                      </dd>
                    </dl>
                    <dl>
                      <dt>{t('Project.Contact')}</dt>
                      <dd>{detail?.ContantWay}</dd>
                    </dl>
                    <dl>
                      <dt>{t('Project.OfficialLink')}</dt>
                      <dd>{detail?.OfficialLink}</dd>
                    </dl>
                    <dl>
                      <dt>{t('Project.Budget')}</dt>
                      <dd>{detail?.Budgets}</dd>
                    </dl>
                    <dl>
                      <dt>{t('Project.Deliverables')}</dt>
                      <dd>{detail?.Deliverable}</dd>
                    </dl>
                    <dl>
                      <dt>{t('Project.PlanFinishTime')}</dt>
                      <dd>{detail?.PlanTime}</dd>
                    </dl>
                  </DlBox>
                  {/*<MdPreview theme={theme ? 'dark' : 'light'} modelValue={detail?.intro || ''} />*/}
                </ContentBox>
              </LastLine>
            </AllBox>
          </FlexLine>
        </Content>
      </Box>
    </OuterBox>
  );
}

const FlexFirst = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
`;

const StatusBox = styled.div`
  font-size: 12px;
  color: #fff;
  background: var(--bs-primary);
  padding: 2px 12px;
  border-radius: 4px;
  &.pending_close {
    background: #1f9e14;
  }
`;

const MemBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  color: var(--font-color-title);
  line-height: 18px;
  margin-bottom: 10px;
  gap: 10px;
  //span {
  //  margin-right: 5px;
  //}
`;

const Avatar = styled.div`
  img {
    width: 30px;
    height: 30px;
    object-fit: cover;
    object-position: center;
    border-radius: 100%;
  }
`;
const DlBox = styled.div`
  margin-top: 40px;
  dl {
    margin-bottom: 20px;
  }
  dt {
    margin-bottom: 10px;
    font-size: 12px;
    opacity: 0.6;
  }
  dd {
    opacity: 0.8;
  }
`;

const BtnTop = styled(Link)`
  position: absolute;
  right: 20px;
  top: 20px;
`;

const OuterBox = styled.div`
  ${ContainerPadding};
  min-height: 100%;
  @media (max-width: 1024px) {
    .nav {
      flex-wrap: nowrap;
    }
    .nav-item {
      white-space: nowrap;
    }
  }
`;

const Box = styled.div`
  position: relative;
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  display: flex;
  margin-top: -30px;
`;

const AllBox = styled.div`
  flex-grow: 1;
  margin-right: 18px;
  width: 100%;
`;

const FlexLine = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
`;

const LastLine = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin-top: 15px;
  padding-bottom: 60px;
  flex-shrink: 0;
  min-height: calc(100% - 110px);
`;

const LftBox = styled.div`
  width: 290px;
  background: var(--bs-box--background);
  border-radius: 16px;
  flex-shrink: 0;
`;

const InnerLft = styled.div`
  box-sizing: border-box;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: space-between;

  background: var(--bs-box--background);
  box-shadow: var(--box-shadow);
  border-radius: 16px;
  padding: 22px 24px;
`;

const TopBoxLeft = styled.div`
  display: flex;
`;

const TopImg = styled.div`
  margin-right: 18px;
  img {
    width: 110px;
    height: 110px;
    object-fit: cover;
    object-position: center;
    border-radius: 16px;
  }
`;

const TitleBox = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: var(--bs-body-color_active);
  line-height: 36px;
  font-family: 'Poppins-Bold';
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

const ProposalBox = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const ContentBox = styled.div`
  border-radius: 16px;
  background: var(--bs-box--background);
  padding: 24px;
  flex-grow: 1;
  //margin-left: 16px;
  color: var(--bs-body-color_active);
  position: relative;
  img {
    max-width: 100%;
  }
`;

const StatusTag = styled.span`
  display: inline-block;
  border-radius: 8px;
  padding-inline: 10px;
  border: 1px solid var(--bs-primary);
  line-height: 26px;
  height: 26px;
  font-size: 12px;
  color: var(--bs-primary);
`;
