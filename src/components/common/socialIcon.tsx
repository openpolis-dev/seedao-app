import styled from 'styled-components';
import TwitterIcon from 'assets/Imgs/profile/xIcon.png';
import MirrorIcon from 'assets/Imgs/social/mirror.png';
import MirrorIconDark from 'assets/Imgs/social/mirror_dark.png';
import EmailIcon from 'assets/Imgs/social/email.png';
import GithubIcon from 'assets/Imgs/social/github.png';
import GithubIconDark from 'assets/Imgs/social/github_dark.png';
import { useMemo } from 'react';
import { useAuthContext } from 'providers/authProvider';
import { useTranslation } from 'react-i18next';
import { IUser } from 'type/user.type';

export enum SocaialType {
  Twitter = 1,
  Mirror,
  Email,
  Github,
}

interface IProps {
  type: SocaialType;
  value?: string;
}

export function SocialIcon({ type, value }: IProps) {
  const {
    state: { theme },
  } = useAuthContext();
  const { t } = useTranslation();
  const icon = useMemo(() => {
    switch (type) {
      case SocaialType.Twitter:
        return TwitterIcon;
      case SocaialType.Github:
        return theme ? GithubIconDark : GithubIcon;
      case SocaialType.Email:
        return EmailIcon;
      case SocaialType.Mirror:
        return theme ? MirrorIconDark : MirrorIcon;
      default:
        return '';
    }
  }, [type, theme]);
  if (value) {
    return (
      <IconHrefBox href={value} target="_blank" rel="noreferrer">
        <img src={icon} alt="" />
      </IconHrefBox>
    );
  } else {
    return (
      <IconDisbaledBox theme={theme ? 'dark' : 'light'}>
        <img src={icon} alt="" />
        <span className="tooltip">{t('members.NotFilled')}</span>
        <span className="arrow"></span>
      </IconDisbaledBox>
    );
  }
}

export default function SocialIconBox({ user }: { user: IUser }) {
  return (
    <LinkBox>
      <SocialIcon type={SocaialType.Twitter} value={user.twitter_profile} />
      <SocialIcon type={SocaialType.Mirror} value={user.mirror} />
      <SocialIcon type={SocaialType.Email} value={user.email ? `mailto:${user.email}` : ''} />
      <SocialIcon type={SocaialType.Github} value={user.github_profile} />
    </LinkBox>
  );
}

const LinkBox = styled.div``;

const IconHrefBox = styled.a`
  img {
    width: 24px;
  }
`;

const IconDisbaledBox = styled.div<{ theme: string }>`
  display: inline-block;
  position: relative;
  &:hover .tooltip,
  &:hover .arrow {
    display: inline-block;
  }

  img {
    width: 24px;
    opacity: 0.4;
  }
  .tooltip {
    display: none;
    position: absolute;
    padding-inline: 11px;
    border-radius: 8px;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    bottom: -36px;
    left: 8px;
    transform: translateX(-50%);

    white-space: nowrap;
    background: ${({ theme }) => (theme === 'light' ? '#1A1323' : '#fff')};
    color: ${({ theme }) => (theme === 'light' ? '#fff' : '#0D0C0F')};
    z-index: 99;
    font-size: 14px;
    font-family: Poppins-Medium, Poppins;
    font-weight: 500;
    color: ${({ theme }) => (theme === 'light' ? '#fff' : '#1A1323')};
    line-height: 30px;
  }
  .arrow {
    display: none;
    position: absolute;
    bottom: -8px;
    left: 3px;
    transform: translateX(50%);
    padding: 4px;
    background: ${({ theme }) => (theme === 'light' ? '#1A1323' : '#fff')};
    clip-path: polygon(50% 0%, 0 100%, 100% 100%);
  }
`;
