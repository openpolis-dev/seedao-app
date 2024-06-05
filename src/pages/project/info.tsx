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
import CategoryTag, { formatCategory } from 'components/proposalCom/categoryTag';
import LinkImg from '../../assets/Imgs/link.svg';
import DefaultAvatar from 'assets/Imgs/defaultAvatar.png';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import ProfileComponent from 'profile-components/profile';

const formatLink = (link: string) => {
  console.log('link', link, link.length);
  if (link.startsWith('/proposal/')) {
    return `${window.location.origin}${link}`;
  }
  return link;
};

type UserMap = { [w: string]: IUser };
export default function InfoPage() {
  const { t } = useTranslation();

  const {
    state: { theme, account },
    dispatch,
  } = useAuthContext();

  const { id } = useParams();
  const { getMultiSNS } = useQuerySNS();
  const [detail, setDetail] = useState<any>();
  // const [snsMap, setSnsMap] = useState<any>({});
  const [userMap, setUserMap] = useState<UserMap>({});
  const [sponserList, setSponserList] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);

  const canCreateProject = usePermission(PermissionAction.CreateApplication, PermissionObject.Project);

  useEffect(() => {
    id && getDetail();
  }, [id]);

  useEffect(() => {
    if (!detail) return;
    getUsersDetail(detail.sponsors);

    const AccountAuth = detail.sponsors.filter((item: string) => item.toLocaleString() === account?.toLowerCase());
    if (AccountAuth.length) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [detail]);

  const getUsersDetail = async (dt: any) => {
    const _wallets: string[] = [];

    dt?.forEach((w: any) => {
      if (ethers.utils.isAddress(w)) {
        _wallets.push(w);
      }
    });
    const wallets = Array.from(new Set(_wallets));
    let userSns = await getMultiSNS(wallets);

    // setSnsMap(userSns);
    await getUsersInfo(wallets, userSns);
  };

  const getUsersInfo = async (wallets: string[], snsMap: any) => {
    dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      const res = await getUsers(wallets);
      const userData: UserMap = {};
      res.data?.forEach((r) => {
        userData[(r.wallet || '').toLowerCase()] = r;
      });
      setUserMap(userData);

      let arr: any[] = [];

      detail?.sponsors.map((item: any) => {
        let itemInfo = userData[item];
        let itemSns = snsMap?.get(item);
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
      const { data } = dt;
      const { budgets } = data;

      let total: string[] = [];
      let ratio: string[] = [];
      let paid: string[] = [];
      let remainAmount: string[] = [];
      let prepayTotal: string[] = [];
      let prepayRemain: string[] = [];

      budgets?.map((item: any) => {
        console.log(item);
        total.push(`${item.total_amount} ${item.asset_name}`);
        ratio.push(`${item.advance_ratio * 100}% ${item.asset_name}`);
        paid.push(`${item.used_advance_amount} ${item.asset_name}`);
        remainAmount.push(`${item.remain_amount} ${item.asset_name}`);
        prepayTotal.push(`${item.total_advance_amount} ${item.asset_name}`);
        prepayRemain.push(`${item.remain_advance_amount} ${item.asset_name}`);
      });

      data.total = total.join(' , ');
      data.ratio = ratio.join(' , ');
      data.paid = paid.join(' , ');
      data.remainAmount = remainAmount.join(' , ');
      data.prepayTotal = prepayTotal.join(' , ');
      data.prepayRemain = prepayRemain.join(' , ');

      console.error(budgets);
      setDetail(data);
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
    switch (detail?.status) {
      case ProjectStatus.Closed:
        return <StatusBox className="close">{t('Project.Closed')}</StatusBox>;
      case ProjectStatus.Open:
        return <StatusBox>{t('Project.Open')}</StatusBox>;
      case ProjectStatus.Closing:
        return <StatusBox>{t('Project.Closing')}</StatusBox>;
      case ProjectStatus.CloseFailed:
        return <StatusBox className="close-failed">{t('Project.CloseFailed')}</StatusBox>;
    }
  };

  const formatDate = (date: number) => {
    if (date) {
      let time = Number(date);
      return dayjs(time).format(`YYYY-MM-DD`);
    } else {
      return '';
    }
  };

  const formatBudget = (str: string) => {
    if (!str) return;
    console.error(str);
    let strJson = JSON.parse(str);

    let strArr: any[] = [];
    strJson?.map((item: any) => {
      strArr.push({ ...item });
    });
    return strArr ?? [];
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
                      {/*<ProposalBox>*/}
                      {/*  {detail?.proposals?.map((item: any, index: number) => (*/}
                      {/*    <SipTag key={index} slug={item} />*/}
                      {/*  ))}*/}
                      {/*</ProposalBox>*/}
                      {detail?.SIP && <SipTagStyle>SIP - {detail?.SIP}</SipTagStyle>}
                      {detail?.Category && <CategoryTag>{formatCategory(detail?.Category)}</CategoryTag>}
                      {/*<StatusBox className={detail?.status}>{t(`Project.Edit`)}</StatusBox>*/}
                      {showStatusComponent()}
                    </FlexFirst>
                  </TopInfo>
                </TopBoxLeft>
                {detail?.status === 'closed' ? (
                  <ClosedButton disabled>{t('Project.Edit')}</ClosedButton>
                ) : canCreateProject || show ? (
                  <BtnTop to={`/project/edit/${detail?.id}`} state={detail}>
                    <Button>{t('Project.Edit')}</Button>
                  </BtnTop>
                ) : null}
              </TopBox>
              <LastLine>
                {/*<LftBox>*/}
                {/*  <InnerLft>*/}
                {/*    <Members detail={detail} updateProject={onUpdate} />*/}
                {/*  </InnerLft>*/}
                {/*</LftBox>*/}

                <NewContentBox>
                  <ul className="lft">
                    <dl>
                      <dt>{t('Project.Moderator')}</dt>
                      <dd className="first">
                        <ModoratorBox>
                          <div className="title">{t('Project.Moderator')}</div>
                          {sponserList.map((item: any, index: number) => (
                            <MemBox key={`avatar_${index}`}>
                              <Avatar onClick={() => setProfileVisible(true)}>
                                <img src={item?.sp?.avatar || item?.avatar || DefaultAvatar} alt="" />
                              </Avatar>
                              <span>
                                {item?.sns?.endsWith('.seedao') ? item.sns : publicJs.AddressToShow(item?.wallet)}
                              </span>
                            </MemBox>
                          ))}
                        </ModoratorBox>
                        <ModoratorBox>
                          <div className="title">{t('Project.Contact')}</div>
                          <div className="rhtContact">
                            {detail?.ContantWay
                              ? detail?.ContantWay
                              : sponserList[0]?.sns?.endsWith('.seedao')
                              ? sponserList[0]?.sns
                              : ''}
                          </div>
                        </ModoratorBox>
                      </dd>
                    </dl>
                    <dl>
                      <dt>{t('Project.projectproposalInfo')}</dt>
                      <dd>
                        <table>
                          <tr>
                            <td>{t('Project.StartProjectLink')}</td>
                            <td>
                              {!!detail?.ApprovalLink && (
                                <>
                                  {/*<span>{formatLink(detail?.ApprovalLink)}</span>{' '}*/}
                                  <Link to={formatLink(detail?.ApprovalLink)} target="_blank">
                                    {/*<img src={LinkImg} alt="" />*/}
                                    <span>{formatLink(detail?.ApprovalLink)}</span>
                                  </Link>
                                </>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>{t('Project.Budget')}</td>
                            <td> {detail?.total}</td>
                          </tr>
                          <tr>
                            <td>{t('Project.PlanFinishTime')}</td>
                            <td>{formatDate(detail?.PlanTime)}</td>
                          </tr>
                          <tr>
                            <td>{t('Project.Deliverables')}</td>
                            <td>
                              {!!detail?.Deliverable?.length && (
                                <ReactQuill
                                  theme="snow"
                                  value={detail?.Deliverable}
                                  modules={{ toolbar: false }}
                                  readOnly={true}
                                />
                              )}
                            </td>
                          </tr>
                        </table>
                      </dd>
                    </dl>
                    <dl>
                      <dt>{t('Project.budgetUtil')}</dt>
                      <dd>
                        <table>
                          <tr>
                            <td>{t('Project.projectBudget')}</td>
                            <td> {detail?.total}</td>
                          </tr>
                          <tr>
                            <td>{t('Project.PrepayRatio')}</td>
                            <td>{detail?.ratio}</td>
                          </tr>
                          <tr>
                            <td>{t('Project.AvailableAmount')}</td>
                            <td>{detail?.prepayTotal}</td>
                          </tr>
                          <tr>
                            <td>{t('Project.CurrentlyPrepaid')}</td>
                            <td>{detail?.paid}</td>
                          </tr>
                          <tr>
                            <td>{t('Project.BudgetBalance')}</td>
                            <td>{detail?.remainAmount}</td>
                          </tr>
                          <tr>
                            <td>{t('Project.AvailableBalance')}</td>
                            <td>{detail?.prepayRemain}</td>
                          </tr>
                        </table>
                      </dd>
                    </dl>
                    <dl>
                      <dt>{t('Project.CompletionInformation')}</dt>
                      <dd>
                        <table>
                          <tr>
                            {
                              !!detail?.OverLink && <td>{t("Project.EndProjectLink")}</td>
                            }

                            <td>
                              {!!detail?.OverLink && (
                                <Link to={formatLink(detail?.OverLink)} target="_blank">
                                  <img src={LinkImg} alt="" />
                                </Link>
                              )}
                              {!detail?.OverLink && <div>{t('Project.notOff')}</div>}
                            </td>
                          </tr>
                        </table>
                      </dd>
                    </dl>
                  </ul>
                  <ul className="rht">
                    <dl>
                      <dt>{t('Project.ProjectIntro')}</dt>
                      <dd>
                        {!!detail?.desc && <Desc>{detail?.desc}</Desc>}
                        {!detail?.desc && <span>{t('Project.introTips')}</span>}
                      </dd>
                    </dl>
                    <dl>
                      <dt>{t('Project.OfficialLink')}</dt>
                      <dd>
                        {!detail?.OfficialLink && <span>{t('Project.officialTips')}</span>}
                        {!!detail?.OfficialLink && (
                          <a href={detail?.OfficialLink} target="_blank" rel="noreferrer">
                            {detail?.OfficialLink}
                          </a>
                        )}
                      </dd>
                    </dl>
                  </ul>
                </NewContentBox>

                {/*<ContentBox>*/}
                {/*  {detail?.status === 'closed' ? (*/}
                {/*    <ClosedButton disabled>{t('Project.Edit')}</ClosedButton>*/}
                {/*  ) : canCreateProject || show ? (*/}
                {/*    <BtnTop to={`/project/edit/${detail?.id}`} state={detail}>*/}
                {/*      <Button>{t('Project.Edit')}</Button>*/}
                {/*    </BtnTop>*/}
                {/*  ) : null}*/}

                {/*  /!*<TitleBox>{t('Project.ProjectIntro')}</TitleBox>*!/*/}
                {/*  <DlBox>*/}
                {/*    <dl>*/}
                {/*      <dt>{t('Project.ProjectIntro')}</dt>*/}
                {/*      <dd>*/}
                {/*        <Desc>{detail?.desc}</Desc>*/}
                {/*      </dd>*/}
                {/*    </dl>*/}
                {/*    <dl>*/}
                {/*      <dt>{t('Project.StartProjectLink')}</dt>*/}
                {/*      <dd>*/}
                {/*        {!!detail?.ApprovalLink && (*/}
                {/*          <>*/}
                {/*            <span>{formatLink(detail?.ApprovalLink)}</span>{' '}*/}
                {/*            <Link to={formatLink(detail?.ApprovalLink)} target="_blank">*/}
                {/*              <img src={LinkImg} alt="" />*/}
                {/*            </Link>*/}
                {/*          </>*/}
                {/*        )}*/}
                {/*      </dd>*/}
                {/*    </dl>*/}
                {/*    <dl>*/}
                {/*      <dt>{t('Project.EndProjectLink')}</dt>*/}
                {/*      <dd>*/}
                {/*        {!!detail?.OverLink && (*/}
                {/*          <>*/}
                {/*            <span>{formatLink(detail?.OverLink)}</span>{' '}*/}
                {/*            <Link to={formatLink(detail?.OverLink)} target="_blank">*/}
                {/*              <img src={LinkImg} alt="" />*/}
                {/*            </Link>*/}
                {/*          </>*/}
                {/*        )}*/}
                {/*      </dd>*/}
                {/*    </dl>*/}
                {/*    <dl>*/}
                {/*      <dt>{t('Project.Moderator')}</dt>*/}
                {/*      <dd>*/}
                {/*        {sponserList.map((item: any, index: number) => (*/}
                {/*          <MemBox key={`avatar_${index}`}>*/}
                {/*            <Avatar onClick={() => setProfileVisible(true)}>*/}
                {/*              <img src={item?.sp?.avatar || item?.avatar || DefaultAvatar} alt="" />*/}
                {/*            </Avatar>*/}
                {/*            <span>*/}
                {/*              {item?.sns?.endsWith('.seedao') ? item.sns : publicJs.AddressToShow(item?.wallet)}*/}
                {/*            </span>*/}
                {/*          </MemBox>*/}
                {/*        ))}*/}
                {/*      </dd>*/}
                {/*    </dl>*/}
                {/*    <dl>*/}
                {/*      <dt>{t('Project.Contact')}</dt>*/}
                {/*      <dd>*/}
                {/*        {detail?.ContantWay*/}
                {/*          ? detail?.ContantWay*/}
                {/*          : sponserList[0]?.sns?.endsWith('.seedao')*/}
                {/*          ? sponserList[0]?.sns*/}
                {/*          : ''}*/}
                {/*      </dd>*/}
                {/*    </dl>*/}
                {/*    <dl>*/}
                {/*      <dt>{t('Project.OfficialLink')}</dt>*/}
                {/*      <dd>*/}
                {/*        {!!detail?.OfficialLink && (*/}
                {/*          <>*/}
                {/*            <span>{detail?.OfficialLink}</span>*/}
                {/*            <a href={detail?.OfficialLink} target="_blank" rel="noreferrer">*/}
                {/*              <img src={LinkImg} alt="" />*/}
                {/*            </a>*/}
                {/*          </>*/}
                {/*        )}*/}
                {/*      </dd>*/}
                {/*    </dl>*/}
                {/*    <dl>*/}
                {/*      <dt>{t('Project.Budget')}</dt>*/}
                {/*      <dd>*/}
                {/*        {formatBudget(detail?.Budgets)?.map((i, index) => (*/}
                {/*          <FlexBox key={`budget_${index}`}>*/}
                {/*            <span>{i.name}</span>*/}
                {/*          </FlexBox>*/}
                {/*        ))}*/}
                {/*      </dd>*/}
                {/*    </dl>*/}
                {/*    <dl>*/}
                {/*      <dt>{t('Project.Deliverables')}</dt>*/}
                {/*      <dd>*/}
                {/*        {!!detail?.Deliverable?.length && (*/}
                {/*          <ReactQuill*/}
                {/*            theme="snow"*/}
                {/*            value={detail?.Deliverable}*/}
                {/*            modules={{ toolbar: false }}*/}
                {/*            readOnly={true}*/}
                {/*          />*/}
                {/*        )}*/}
                {/*      </dd>*/}
                {/*    </dl>*/}

                {/*    <dl>*/}
                {/*      <dt>{t('Project.PlanFinishTime')}</dt>*/}
                {/*      <dd>{formatDate(detail?.PlanTime)}</dd>*/}
                {/*    </dl>*/}
                {/*  </DlBox>*/}
                {/*  /!*<MdPreview theme={theme ? 'dark' : 'light'} modelValue={detail?.intro || ''} />*!/*/}
                {/*</ContentBox>*/}
              </LastLine>
            </AllBox>
          </FlexLine>
          {profileVisible && (
            <ProfileComponent
              address={sponserList[0]?.wallet}
              theme={theme}
              handleClose={() => setProfileVisible(false)}
            />
          )}
        </Content>
      </Box>
    </OuterBox>
  );
}

const NewContentBox = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 32px;
  width: 100%;
  margin-bottom: 32px;
  .lft,
  .rht {
    flex-grow: 1;
    width: 50%;
    display: flex;
    flex-direction: column;
  }
  .rht {
    dl {
      flex-grow: 1;
    }
  }
  dl {
    background: var(--bs-box--background);
    box-shadow: var(--box-shadow);
    border-radius: 16px;
    padding: 22px 24px;
    margin-top: 32px;
  }
  dt {
    color: var(--bs-body-color_active);
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 18px;
  }
  dd {
    font-size: 14px;
  }

  .first {
    display: flex;
  }
  .title {
    font-size: 14px;
    color: var(--bs-body-color);
  }

  .rht {
    color: var(--bs-body-color);
  }
  table {
    width: 100%;
  }
  td {
    color: var(--bs-body-color);
    font-size: 14px;
    padding-bottom: 10px;
    vertical-align: top;

    &:first-child {
      padding-right: 20px;
      white-space: nowrap;
    }
    &:nth-child(2) {
      color: var(--bs-body-color_active);
      word-break: break-all;
      width: 100%;
    }
  }
  .quill {
    width: 100%;
  }
  .ql-container {
    width: 100% !important;
    border: 0;
  }
  .ql-editor {
    padding: 0;
  }

  a {
    color: var(--bs-primary);
  }
`;

const ModoratorBox = styled.div`
  flex-grow: 1;
  .rhtContact {
    color: var(--bs-body-color_active);
  }
  .title {
    padding-bottom: 10px;
  }
`;

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

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
  line-height: 22px;
  height: 26px;
  &.pending_close {
    background: #f9b617;
  }
  &.close {
    background: rgb(163, 160, 160);
  }
  &.close-failed {
    background: rgb(255, 51, 51);
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
    cursor: pointer;
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
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    word-break: break-all;
  }
  .quill {
    width: 100%;
  }
  .ql-container {
    width: 100% !important;
    border: 0;
  }
  p {
    padding: 0;
  }
  .ql-editor {
    width: 100%;
    padding: 0;
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
  //display: flex;
  //align-items: stretch;
  //justify-content: space-between;
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
  position: relative;
`;

const TopBoxLeft = styled.div`
  display: flex;
  align-items: center;
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

const SipTagStyle = styled.a`
  display: inline-block;
  border-radius: 5px;
  border: 1px solid #0085ff;
  font-size: 12px;
  padding: 2px 12px;
  line-height: 22px;
  height: 26px;
  color: #0085ff;
  &:hover {
    color: #0085ff;
  }
`;

const ClosedButton = styled(Button)`
  position: absolute;
  right: 20px;
  top: 20px;
`;

const Desc = styled.div`
  white-space: pre-wrap;
`;
