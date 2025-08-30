export interface Channel {
    _id: string;
    name: string;
}

export interface Message {
    id: string;
    content: string;
    username: string;
    timestamp: string;
}