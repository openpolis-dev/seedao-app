import styled from "styled-components";
import { ChatInterface } from "./ChatInterface";

const Box = styled.div`
  max-width: 800px;
    width: 100%;
     margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    
`

export default function AiChat(){
  return <Box>
    <ChatInterface />
  </Box>
}
