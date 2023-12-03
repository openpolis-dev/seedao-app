import styled from 'styled-components';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import RhtArr from '../../assets/Imgs/profile/right.svg';

import 'swiper/css';
import 'swiper/css/navigation';

const Box = styled.div`
  width: 100%;
  min-height: 10px;
  display: flex;
  align-items: center;
  position: relative;
  .mySwiper {
  }
  .swiper-slide {
    display: flex;
    width: 88px;
  }

  .lft {
    position: relative;
    margin-right: 20px;
    background: url(${RhtArr}) no-repeat;
    transform: rotate(180deg);
    &:after {
      content: '';
    }
  }
  .rht {
    position: relative;
    margin-left: 20px;
    margin-top: 15px;
    background: url(${RhtArr}) no-repeat;
    &:after {
      content: '';
    }
  }
`;
const OuterBox = styled.div`
  width: calc(100vw - 440px);
`;

const LiBox = styled.div`
  width: 88px;
  img {
    width: 88px;
    height: 88px;
    object-fit: cover;
    object-position: center;
    border-radius: 16px;
  }
  span {
    display: inline-block;
    width: 100%;
    text-align: center;
    padding: 9px 0 0;
  }
`;

interface Iprops {
  list: any[];
}

export default function SeedList(props: Iprops) {
  const { list } = props;

  return (
    <Box>
      <div className={`swiper-button-prev lft swiper-button-prev_nft`}></div>

      <OuterBox>
        <Swiper
          className="mySwiper"
          slidesPerView="auto"
          navigation={{
            nextEl: `.swiper-button-next_nft`,
            prevEl: `.swiper-button-prev_nft`,
          }}
          modules={[Navigation]}
          spaceBetween={20}
        >
          {!!list?.length &&
            list.map((item: any, index: number) => (
              <SwiperSlide key={index}>
                <LiBox>
                  <img src={item.url} alt="" />
                  <span># {item.token_id}</span>
                </LiBox>
              </SwiperSlide>
            ))}
        </Swiper>
      </OuterBox>
      <div className={`swiper-button-next rht swiper-button-next_nft`}></div>
    </Box>
  );
}
