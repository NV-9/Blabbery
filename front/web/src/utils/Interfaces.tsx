

export interface Message {
    sender: string;
    content: string;
}

export interface User {
    id: number;
    user_uuid: string;
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
    name: string;
    limit: number;
    users: User[];
    isGroup: boolean;
}

export interface GroupRoom extends Room {
    rules: string;
    online: User[];
    staff: User[];
}

export interface DirectRoom extends Room {
    user: User;
}

export interface MenuItem {
    key: string;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
};