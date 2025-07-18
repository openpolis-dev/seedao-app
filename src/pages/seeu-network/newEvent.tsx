import styled from "styled-components"
import {Image} from "lucide-react";

const Box = styled.div`
  width: 100%;
    height: 100%;
    .period{
        font-size: 12px;
        height: 22px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .itemBox{
        height: 100%;
    }
    .item-content{
        padding: 0;
        h5{
            background: var( --home-right);
            padding: 10px;
            box-sizing: content-box;
            margin-top: 0;
        }
    }
    .btm{
        padding: 10px;
    }
    .city{
        color:var(--bs-primary);
        font-size: 12px;
    }
    .items-img{
        //height: 260px;
        aspect-ratio: 3/2;
        width: 100%;
        object-fit: cover;
        object-position: center;
    }
    .noPicture{
        //height: 260px;
        aspect-ratio: 3/2;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .item-status{
        display: flex;
        justify-content: space-between;
    }
    .item-tags{
        padding-top: 5px;
        align-items: center;
        gap:5px;
        display: flex;
    }
    .tags{
        background:var(--bs-primary);
        padding: 2px 5px;
        border-radius: 4px;
        font-size: 12px;
        color:var(--bs-menu-hover);
        display: inline-block;
        max-width: 200px;
        height: 22px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
`

const TagBox = styled.span<any>`
    background:${props => props.color};
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 12px;
    color:var(--bs-menu-hover);
    display: inline-block;
`



export default function NewEvent({ item }:any){
  const stringToColor = (str:string) => {
    const TAG_COLORS:any = {
      // 原有颜色
      "手工技艺": '#FF86CB',
      "乡野漫步": '#FFB842',
      "人文艺术": '#03DACD',
      "社会组织创新": '#A78BFA',
      "生活活动": '#48BB78',
      "科学技术": '#4299E1',
      "放空": '#F56565',
    };
    return TAG_COLORS[str] ?? "#ED8936";


  }
  return <Box >
    <a
    href={`/event/view?id=${item.id}`}>
    <div className="itemBox">
      {
        !!item?.poster && <img className="items-img" src={`/data/images/${item?.poster}`} />
      }
      {
        !item?.poster && <div className="noPicture">
          <img className="items-img" src="/data/images/meetup.jpg" />
        </div>
      }

      <div className="item-content"><h5>{item.subject}</h5>
        <div className="btm">
          <h6>{item.startDay}</h6>
          <div className="period">{item.startTime}</div>
          <div className="item-status">
            <span className="city">{item.city}</span>
            {!!item.activeTime &&<span className="status">🚀活动时长:{item.activeTime}</span>}</div>
               <div className="item-tags">
                 {!!item.fee && <span className="tags">{item.fee}</span>}
                 {!!item?.type && <TagBox color={stringToColor(item?.type)}>{item?.type}</TagBox>}
            </div>

        </div>

      </div>
    </div>
  </a>
  </Box>
}
