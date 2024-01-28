// @ts-nocheck
import styled, {ThemeProvider} from 'styled-components';
import React, {useEffect, useState} from 'react';

// Pages
import Homepage from "./components/Homepage";
import Settings from "./components/Settings";
import {PageContext} from './components/PageContext';
import {callScript} from "./CallScript";

// Theme
const theme = {
    primary: "#1B3409",
    secondary: "#EBF7E3",
    text: "#000000",
    accent: "#FFFFFF"
};

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isOpen, setOpen] = useState(false)

    const changePage = (page: string) => setCurrentPage(page);

    useEffect(() => {
        const reactAppDiv = document.getElementById('react-app');
        if (reactAppDiv) {
            reactAppDiv.style.pointerEvents = isOpen ? 'auto' : 'none';
        }
    }, [isOpen]);

    return <>
        <AppContainer isOpen={isOpen}>
            <ThemeProvider theme={theme}>
                <PageContext.Provider value={{currentPage, changePage, setOpen, isOpen}}>
                    {currentPage === 'home' ? <Homepage/> : <Settings/>}
                </PageContext.Provider>
            </ThemeProvider>
        </AppContainer>
        {!isOpen && <OpenButton onClick={() => setOpen(true)}>
        </OpenButton>
        }
    </>
}

// DOM Element CSS Is Located in Chrome/ContentScripts/Embed.js
const AppContainer = styled.div<{ isOpen: boolean }>`
    width: 100%;
    height: 100%;
    display: ${props => props.isOpen ? 'block' : 'none'};

`
const OpenButton = styled.div`
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
    background: white;
    border-radius: 50%;
    z-index: 10000001;
    pointer-events: auto;
`;