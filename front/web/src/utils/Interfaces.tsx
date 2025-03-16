

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
    name: string;
    room_uuid: string;
    rules: string;
    limit: number;
}

export interface GroupRoom extends Room {
    users: User[];
    online: User[];
    staff: User[];
}

export interface DirectRoom extends Room {
    user: User;
    online: boolean;
}
