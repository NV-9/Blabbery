

export interface Message {
    sender: string;
    content: string;
}

export interface User {
    id: number;
    name: string;
}

export interface BaseProps {
    isAuthenticated: boolean;
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}