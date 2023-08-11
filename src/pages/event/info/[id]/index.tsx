import React, { useEffect, useState } from 'react';
import Layout from 'Layouts';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { Tabs, Tab } from '@paljs/ui/Tabs';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Card } from '@paljs/ui/Card';
import { EvaIcon } from '@paljs/ui/Icon';

import useTranslation from 'hooks/useTranslation';

const Box = styled.div`
  position: relative;
  .tab-content {
    padding: 0 !important;
  }
`;

const CardBox = styled(Card)`
  min-height: 85vh;
`;

const BackBox = styled.div`
  padding: 30px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon {
    font-size: 24px;
  }
`;

const ContentBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 40px 20px;
  border-bottom: 1px solid #eee;
`;

const LftBox = styled.div`
  width: 30%;
  img {
    width: 100%;
  }
`;
const RhtBox = styled.div`
  width: 69%;
  padding: 10px 0;
`;
const TitBox = styled.div`
  font-size: 2rem;
  line-height: 3em;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
`;
const RhtCenter = styled.ul`
  border-bottom: 1px solid #eee;
  padding: 20px 0;
  li {
    line-height: 2em;
  }
`;

const Btm = styled.div`
  dl {
    margin-top: 20px;
    display: flex;
    align-content: center;
    line-height: 2em;
  }
  dt {
    font-weight: bold;
    width: 150px;
    background: #f5f5f5;
    padding: 0 10px;
    margin-right: 20px;
    text-align: center;
  }
`;

const MainContent = styled.div`
  padding: 40px;
`;
export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Layout title="SeeDAO Project">
      <CardBox>
        <Box>
          <BackBox onClick={() => router.back()}>
            <EvaIcon name="chevron-left-outline" className="icon" /> <span> {t('general.back')}</span>
          </BackBox>
          <ContentBox>
            <LftBox>
              <img src="https://seedao-store.s3-us-east-2.amazonaws.com/seeu/srzzPofjFbCQ5LGzvWd9Uc.jpg" alt="" />
            </LftBox>
            <RhtBox>
              <TitBox>SeeU in Singapore - 新加坡养生杯篮球联赛 （以球会友，连接东西）</TitBox>
              <RhtCenter>
                <li>Sat, Aug 12, 2023, 3:00 PM</li>
                <li>Sat, Aug 12, 2023, 3:00 PM</li>
              </RhtCenter>

              <Btm>
                <dl>
                  <dt>主持人</dt>
                  <dd>Tong Wang</dd>
                </dl>
                <dl>
                  <dt>主持人</dt>
                  <dd>Tong Wang</dd>
                </dl>
                <dl>
                  <dt>主持人</dt>
                  <dd>Tong Wang</dd>
                </dl>
                <dl>
                  <dt>主持人</dt>
                  <dd>Tong Wang</dd>
                </dl>
              </Btm>
            </RhtBox>
          </ContentBox>

          <MainContent>
            <div className="MuiBox-root css-0">
              <p> 🥷 Initiator</p>
              <ul>
                <li>Name: Tony Wang</li>
                <li>SeeDAO role: SeeDAO ambassador at Singapore</li>
                <li>Contact Info: WeChat - 18066050127; Telegram: jlzxwt8</li>
              </ul>
              <p>
                <br />
              </p>
              <p>时间：2023年8月12号到13号：12号下午3点到8点；13号下午1点到7点</p>
              <p>地点：Kranji Secondary School Singapore 活动背景：</p>
              <p>
                新加坡养生杯篮球联赛由SeeDAO和.bit携手上海交通大学新加坡校友会、Alibaba&nbsp;Cloud、华为NTU&amp;NUS校友篮球联队与HoYoverse篮球队共同发起，旨在
                <strong>
                  加强新移民对新加坡的归属感、积极参与新加坡的社会建设，同时协助以新加坡为总部的出海企业，拥抱东南亚市场，并进军全球市场
                </strong>
                。
              </p>
              <ul>
                <li>
                  SeeDAO致力于连接 100 万 Web3
                  游民的数字城邦，我们的愿景是在基于地缘的民族国家之外，在赛博世界另建一片人类的生存空间。新加坡凭借安全稳定的政治和居住环境，成为全球数字游民的打卡地之一，也是汇聚了无数资本和人才的创新中心。
                  <strong>SeeDAO意识到体育活动是城邦的重要组成部分，可以更有效地促进成员之间的交流与合作</strong>
                  。因此，我们联合Alibaba
                  Cloud、上海交通大学新加坡校友会等合作伙伴，共同推动篮球联赛，以球会友，连接东西，更好地促进人与人的连接，以及数字城邦的发展；
                </li>
                <li>
                  篮球联赛不仅仅是一场体育赛事，更是传递SeeDAO愿景的载体。我们相信篮球的精神，体现了团队合作、拼搏进取、包容友爱等价值观，正是构建赛博世界所需的基石。正如SeeDAO致力于连接全球Web3游民，篮球联赛也将吸引来自新加坡不同企业和高校校友会的成员，通过篮球作为载体，共同锻炼身体，加深了解，拓展合作，增进友谊；
                </li>
                <li>
                  我们深信，在当今复杂多变的世界格局下，
                  <strong>通过篮球这一全球通用的运动，不仅可以加强在新华人社区的联系和合作，更能跨越国界和文化</strong>
                  。篮球联赛将为SeeDAO愿景的实现提供有力支持，让参与者在活动中体验到多元融合、协同共赢的精神，从而在数字城邦的构建中发挥积极作用
                </li>
              </ul>
              <p>活动描述：</p>
              <p>
                新加坡养生杯篮球联赛有18支球队报名，其中8支球队将在8月12号到13号的两天内进行5场比赛的比拼，为广大球迷朋友带来不可错过、精彩纷呈的篮球盛宴！
              </p>
              <p>
                在这两天的比赛中，每支球队将进行5场激烈对决，展现出技术和默契的风采。精湛的篮球技巧、高水平的球员表现，以及紧张刺激的比分对垒，必将让观众们目不转睛，为自己喜爱的球队呐喊助威。
              </p>
              <p>
                同时，新加坡养生杯篮球联赛注重“养生”理念，我们鼓励运动健身和团队合作，强调参与比赛的每个球员都能在比赛中感受到篮球的魅力，提升身体素质和心理素质。这场比赛将成为彼此交流学习、结识新朋友的绝佳机会，同时促进着球员们之间的友谊和团结。
              </p>
              <p>
                我们诚邀各位篮球爱好者和球迷朋友们踏入比赛现场，一同见证篮球的魅力与激情。无论你是热爱篮球的球迷，还是想要感受篮球比赛氛围的观众，这都是一个不容错过的篮球盛事！
              </p>
              <p>敬请期待充满激情的比赛，让我们一同见证篮球运动的魅力，共同创造属于篮球的精彩时刻！</p>
            </div>
          </MainContent>
        </Box>
      </CardBox>
    </Layout>
  );
}
