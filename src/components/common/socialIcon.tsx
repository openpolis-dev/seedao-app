import styled from 'styled-components';
import TwitterIcon from 'assets/Imgs/social/twitter.svg';
import MirrorIcon from 'assets/Imgs/social/mirror.svg';
import MirrorIconDark from 'assets/Imgs/social/mirror_dark.svg';
import EmailIcon from 'assets/Imgs/social/email.svg';
import GithubIcon from 'assets/Imgs/social/github.svg';
import { useMemo } from 'react';
import { useAuthContext } from 'providers/authProvider';
import { useTranslation } from 'react-i18next';

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

export default function SocialIcon({ type, value }: IProps) {
  const {
    state: { theme },
  } = useAuthContext();
  const { t } = useTranslation();
  const icon = useMemo(() => {
    switch (type) {
      case SocaialType.Twitter:
        return TwitterIcon;
      case SocaialType.Github:
        return theme ? GithubIcon : GithubIcon;
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
        <span className="tooltip">{t('members.NotRegister')}</span>
        <span className="arrow"></span>
      </IconDisbaledBox>
    );
  }
}

const IconHrefBox = styled.a``;

const IconDisbaledBox = styled.div<{ theme: string }>`
  display: inline-block;
  position: relative;
  &:hover .tooltip,
  &:hover .arrow {
    display: inline-block;
  }

  img {
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
