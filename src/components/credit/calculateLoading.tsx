import styled from 'styled-components';

const CalculateLoading = styled.div`
  /* HTML: <div class="loader"></div> */
  width: 10px;
  aspect-ratio: 1;
  border-radius: 50%;
  animation: l5 1s infinite linear alternate;
  @keyframes l5 {
    0% {
      box-shadow: 20px 0 #1814f3, -20px 0 rgba(24, 20, 243, 0.5);
      background: #1814f3;
    }
    33% {
      box-shadow: 20px 0 #1814f3, -20px 0 rgba(24, 20, 243, 0.5);
      background: rgba(24, 20, 243, 0.5);
    }
    66% {
      box-shadow: 20px 0 rgba(24, 20, 243, 0.5), -20px 0 #1814f3;
      background: rgba(24, 20, 243, 0.5);
    }
    100% {
      box-shadow: 20px 0 rgba(24, 20, 243, 0.5), -20px 0 #1814f3;
      background: #1814f3;
    }
  }
`;
export default CalculateLoading;
