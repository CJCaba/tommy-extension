import styled, {ThemeProvider} from 'styled-components';
import React, {useState} from 'react';

// Pages
import Homepage from "./components/Homepage";
import Settings from "./components/Settings";
import {UserInfoContext} from './components/UserInfoContext';
import { PageContext } from './components/PageContext';

// Theme
const theme = {
    primary: "#1B3409",
    secondary: "#EBF7E3",
    text: "#000000",
    accent: "#FFFFFF"
};

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isOpen, setOpen] = useState(true)

    // Input Information to API
    const [name, setName] = useState('');
    const [accountID, setAccountID] = useState('');
    const [message, setMessage] = useState('');

    const changePage = (page: string) => {
        setCurrentPage(page);
    };

    return <AppContainer>
        <ThemeProvider theme={theme}>
            <UserInfoContext.Provider value={{name, accountID, message, setName, setAccountID, setMessage}}>
                <PageContext.Provider value={{currentPage, changePage, setOpen, isOpen}}>
                    {isOpen && (currentPage === 'home' ? <Homepage/> : <Settings/>)}
                </PageContext.Provider>
            </UserInfoContext.Provider>
        </ThemeProvider>
    </AppContainer>
}


// DOM Element CSS Is Located in Chrome/ContentScripts/Embed.js
const AppContainer = styled.div`
    width: 100%;
    height: 100%;
`
