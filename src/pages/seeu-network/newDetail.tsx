import styled from "styled-components";
import dayjs from "dayjs";

const Box = styled.div`
  .lftTop{
      display: flex; 
      align-items: stretch;
      
  }
    .imgBox{
        background: var(--bs-menu-hover);
        border:1px solid var(--bs-border-color_opacity);
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50vw!important;
        aspect-ratio: 16/9;
        flex-shrink: 0;
        overflow: hidden;
        img{
            max-width: 115%;
            max-height: 115%;
            //aspect-ratio: 16/9;
            object-fit: cover;
        }
    }
    .eventDtail{
        width: 100%;
    }
    .ml20{
        padding-left: 10px;
        color:#B0B0B0;
    }
    .eventTitle{
        font-weight: 700;
        margin-top: 30px;
        font-size: 18px;
    }
    .eventSummary{
        padding-bottom: 50px;
    }
`

export default function NewDetail({item}:any) {

  if(!item)return null;

  return <Box className="eventDetail">
    <div  className="lftTop">
      <div className="imgBox">
        {
          !!item.fields['活动照片/海报'] && <img src={`/data/images/${item.fields['活动照片/海报'][0].name}`} />
        }
        {
          !item.fields['活动照片/海报'] &&         <img className="items-img" src="/data/images/meetup.jpg" />
        }
      </div>
      <div className="eventDtail">
        <h2>{item.fields['活动名称'][0].text}</h2>
        <div className="meetDetailBlock">
          <dl>
            <dt>活动时间</dt>
            <dd>
              <span> {dayjs(item.fields['活动日期']).format(`YYYY-MM-DD`)}</span>

              {
                !!item.fields['活动时间'] && <span> {item.fields['活动时间'][0].text}</span>
              }
              {
                !!item.fields['活动时长'] && <span className="ml20">{item.fields['活动时长'] ? item.fields['活动时长'][0].text :""}</span>
              }

            </dd>
          </dl>
        </div>


        {
          !!item.fields['活动地点'] &&<div className="meetDetailBlock">
            <dl>
              <dt>活动地点</dt>
              <dd>{item.fields['活动地点'][0].text}</dd>
            </dl>
          </div>
        }
        {
          !!item?.fields["报名方式"] && <div className="meetDetailBlock">
          <dl>
            <dt>报名方式</dt>
            <dd>{item.fields["报名方式"]}</dd>
          </dl>
        </div>
        }
        {
          !!item?.fields["发起人微信"]?.value[0] && <div className="meetDetailBlock">
          <dl>
            <dt>发起人微信</dt>
            <dd>{item.fields["发起人微信"]?.value[0].text}
            </dd>
          </dl>
        </div>
        }
        {
          !!item?.fields["发起人简介"]?.value[0] && <div className="meetDetailBlock">
            <dl>
              <dt>发起人简介</dt>
              <dd>{item.fields["发起人简介"]?.value[0].text}
              </dd>
            </dl>
          </div>
        }
        {
          !!item?.fields["活动费用"] && <div className="meetDetailBlock">
            <dl>
              <dt>活动费用</dt>
              <dd>{item.fields["活动费用"][0].text}</dd>
            </dl>
          </div>
        }
        {
        !!item?.fields["活动类型"] && <div className="meetDetailBlock">
          <dl>
            <dt>活动类型</dt>
            <dd>{item.fields["活动类型"]}</dd>
          </dl>
        </div>
      }{
        !!item?.fields["限制人数"] && <div className="meetDetailBlock">
          <dl>
            <dt>限制人数</dt>
            <dd>{item.fields["限制人数"][0].text}</dd>
          </dl>
        </div>
      }

      </div>
    </div>
    <div className="eventSummary">

      <div className="eventTitle">活动简介</div>

      {
        !!item?.fields["活动简介"] && <div>
          {
            item?.fields["活动简介"].map((item:any,index:number)=>(     <p className="ql-align-justify" key={index}>{item.text}</p>))
          }


        </div>

      }

    </div>
  </Box>;
}
