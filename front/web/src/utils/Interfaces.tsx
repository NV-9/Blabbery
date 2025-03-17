

export interface Message {
    sender: string;
    content: string;
}

export interface User {
    id: number;
    username: string;
}

export interface AuthProps {
    isAuthenticated: boolean;
}

export interface BaseProps extends AuthProps {
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Room {
    id: string;
    room_uuid: string;
    limit: number;
    name: string;
}

export interface GroupRoom extends Room {
    rules: string;
    users: User[];
    online: User[];
    staff: User[];
}

export interface DirectRoom extends Room {
    user: User;
    online: boolean;
}
