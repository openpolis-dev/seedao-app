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
      <IconDisbaledBox theme={theme}>
        <img src={icon} alt="" />
        <span>{t('members.NotRegister')}</span>
      </IconDisbaledBox>
    );
  }
}

const IconHrefBox = styled.a``;

const IconDisbaledBox = styled.div<{ theme: boolean }>`
  display: inline-block;
  position: relative;
  &:hover span {
    display: inline-block;
  }

  img {
    opacity: 0.4;
  }
  span {
    display: none;
    position: absolute;
    padding-inline: 11px;
    border-radius: 8px;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    bottom: -36px;
    left: 8px;
    transform: translateX(-50%);

    white-space: nowrap;
    background: ${({ theme }) => (theme ? '#1A1323' : '#fff')};
    color: ${({ theme }) => (theme ? '#fff' : '#0D0C0F')};
    z-index: 99;
    font-size: 14px;
    font-family: Poppins-Medium, Poppins;
    font-weight: 500;
    color: ${({ theme }) => (theme ? '#fff' : '#1A1323')};
    line-height: 30px;
    &::before {
      content: '';
      position: absolute;
      border: 6px solid transparent;
      border-bottom-color: ${({ theme }) => (theme ? '#1A1323' : '#fff')};
      top: -10px;
      left: 50%;
      transform: translateX(-3px);
    }
  }
`;
