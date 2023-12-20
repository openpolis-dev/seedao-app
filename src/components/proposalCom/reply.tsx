import styled from 'styled-components';
import POSTS_DATA from './posts';

import CommetComponent from './comment';

export default function ReplyComponent() {
  const findReplyData = (reply_pid?: number) => {
    if (!reply_pid) {
      return null;
    }
    let d: any;
    POSTS_DATA.forEach((p: any) => {
      if (p.id === reply_pid) {
        d = p;
      } else {
        const child = p.children?.posts.find((ip: any) => ip.id === reply_pid);
        if (child) {
          d = child;
        }
      }
    });
    console.log(reply_pid, d.id);
    return d;
  };
  return (
    <ReplyComponentStyle>
      {POSTS_DATA.map((p) => (
        <CommetComponent data={p} key={p.id}>
          {p.children.posts.map((ip) => (
            <CommetComponent data={ip} isChild={true} key={ip.id} parentData={findReplyData(ip.reply_pid)} />
          ))}
        </CommetComponent>
      ))}
    </ReplyComponentStyle>
  );
}

const ReplyComponentStyle = styled.div``;
