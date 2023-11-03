import styled from 'styled-components';
import TwitterIcon from 'assets/Imgs/social/twitter.svg';
import MirrorIcon from 'assets/Imgs/social/mirror.svg';
import MirrorIconDark from 'assets/Imgs/social/mirror_dark.svg';
import EmailIcon from 'assets/Imgs/social/email.svg';
import GithubIcon from 'assets/Imgs/social/github.svg';
import { useMemo } from 'react';
import { useAuthContext } from 'providers/authProvider';

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
  }, [type]);
  if (value) {
    return (
      <IconHrefBox href={value} target="_blank" rel="noreferrer">
        <img src={icon} alt="" />
      </IconHrefBox>
    );
  } else {
    return (
      <IconDisbaledBox>
        <img src={icon} alt="" />
      </IconDisbaledBox>
    );
  }
}

const IconHrefBox = styled.a``;

const IconDisbaledBox = styled.div`
  display: inline-block;
  img {
    opacity: 0.4;
  }
`;
