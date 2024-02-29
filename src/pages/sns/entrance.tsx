import { Link, useSearchParams } from 'react-router-dom';
import Animation from '../../components/sns/animation';
import styled from 'styled-components';
import LogoImg from '../../assets/Imgs/sns.svg';
import { useTranslation } from 'react-i18next';

const Box = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
`;
const TopBox = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const TitleBox = styled.div`
  margin: 49px 0 19px;
  font-size: 50px;
  font-family: 'Poppins-Bold';
  font-weight: 900;
  color: #3f3f3f;
  line-height: 60px;
`;

const TipBox = styled.div`
  font-size: 24px;
  margin-bottom: 62px;
  font-weight: 500;
  color: #3f3f3f;
  line-height: 30px;
`;

const ButtonBox = styled.div`
  width: 226px;
  height: 66px;
  background: #5200ff;
  border-radius: 12px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 500;
  line-height: 30px;
`;
export default function SNSEntrancePage() {
  const { t } = useTranslation();

  const [search] = useSearchParams();
  const inviteCode = search.get('invite');
  return (
    <Box>
      <TopBox>
        <img src={LogoImg} alt="" />
        <TitleBox>{t('SNS.EntranceTitle')}</TitleBox>
        <TipBox>{t('SNS.EntranceDesc')}</TipBox>
        <Link to={`/sns/register${inviteCode ? `?invite=${inviteCode}` : ''}`}>
          <ButtonBox>{t('SNS.Started')}</ButtonBox>
        </Link>
      </TopBox>

      <Animation />
    </Box>
  );
}
