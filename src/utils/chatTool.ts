import { ResponseMessage } from "../pages/aiChat/DBTypes";

export const estimateTokenCount = (text:string)=> {

  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
  const englishWords = text.match(/\b\w+\b/g) || [];
  const punctuationAndSpaces = text.match(/[\s\p{P}]/gu) || [];

  return (
    chineseChars.length * 0.6 + englishWords.length * 0.3 + punctuationAndSpaces.length
  );
}

export const truncateContext = (messages:ResponseMessage[], maxTokens:number) => {
  let totalTokens = 0;
  const truncatedMessages = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const messageTokens = estimateTokenCount(message.content);

    if (totalTokens + messageTokens <= maxTokens) {
      truncatedMessages.unshift(message);
      totalTokens += messageTokens;
    } else {
      break;
    }
  }
  return truncatedMessages;
}
