// Page Context
import React from "react";

interface PageContextType {
    currentPage: string;
    changePage: (page: string) => void;
    setOpen: (open: boolean) => void;
    isOpen: boolean;
}

export const PageContext = React.createContext<PageContextType>({
    currentPage: 'home', // default value
    changePage: () => {
    },
    setOpen: () => {
    },
    isOpen: true
});