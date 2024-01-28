import React, {useContext} from "react";

export interface UserInfoContextType {
    name: string;
    accountID: string;
    message: string;
    setName: (name: string) => void;
    setAccountID: (accountID: string) => void;
    setMessage: (message: string) => void;
}

export const useUserInfo = () => {
    const context = useContext(UserInfoContext);
    if (!context) {
        throw new Error('useUserInfo must be used within a UserInfoProvider');
    }
    return context;
};

export const UserInfoContext = React.createContext<UserInfoContextType>({
    name: '',
    accountID: '',
    message: '',
    setName: () => {
    },
    setAccountID: () => {
    },
    setMessage: () => {
    }
});