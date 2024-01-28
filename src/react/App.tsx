import styled, {ThemeProvider} from 'styled-components';
import React, {useEffect, useState} from 'react';
import {callScript} from './CallScript'

// Pages
import Homepage from "./components/Homepage";
import Settings from "./components/Settings";
import {UserInfoContext} from './components/UserInfoContext';
import {PageContext} from './components/PageContext';

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

    const handleClick = () => {
        callScript("speechText", {});
    };


    useEffect(() => {
        const reactAppDiv = document.getElementById('react-app');
        if (reactAppDiv) {
            reactAppDiv.style.pointerEvents = isOpen ? 'auto' : 'none';
        }
    }, [isOpen]);

    return <>
        <AppContainer isOpen={isOpen}>
            <ThemeProvider theme={theme}>
                <UserInfoContext.Provider value={{name, accountID, message, setName, setAccountID, setMessage}}>
                    <PageContext.Provider value={{currentPage, changePage, setOpen, isOpen}}>
                        <button onClick={handleClick}>click me to run FilteredDOM Method</button>
                        {currentPage === 'home' ? <Homepage/> : <Settings/>}
                    </PageContext.Provider>
                </UserInfoContext.Provider>
            </ThemeProvider>
        </AppContainer>
        {!isOpen && <ReopenButton onClick={() => setOpen(true)}>Open</ReopenButton>}
    </>
}


// DOM Element CSS Is Located in Chrome/ContentScripts/Embed.js
const AppContainer = styled.div<{ isOpen: boolean }>`
    width: 100%;
    height: 100%;
    display: ${props => props.isOpen ? 'block' : 'none'};

`
const ReopenButton = styled.button`
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000001;
    pointer-events: auto;
`;