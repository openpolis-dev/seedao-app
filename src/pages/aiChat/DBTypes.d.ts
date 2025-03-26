
export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    type?: 'thinking' | 'response';
    timestamp: number;
    messageId?:number;
    uniqueId:string;
    questionId:string;
    address:string;
}

export interface ResponseMessage {
    role: 'user' | 'assistant';
    content: string;
}
