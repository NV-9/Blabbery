import { MenuItem } from "./Interfaces";
import { NotificationType } from "./Types";

export const generateMenuItems = (
    isAuthenticated: boolean,
    username: string,
    navigate: (path: string) => void
): MenuItem[] => {
    if (isAuthenticated) {
        return [
            {
                key: "username",
                label: `Logged in as: ${username}`,
                disabled: true,
            },
            {
                key: "logout",
                label: "Logout",
                onClick: () => navigate("/logout"),
            }
        ];
    } else {
        return [
            {
                key: "login",
                label: "Login / Signup",
                onClick: () => navigate("/authenticate"),
            },
        ];
    }
};

export const showNotification = (api: any, title: string, message: string, type: NotificationType) =>
    api[type]({ message: title, description: message, placement: "topRight", duration: 3 });