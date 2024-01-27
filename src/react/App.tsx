import styled, {ThemeProvider} from 'styled-components';
import React, {useState, useContext} from 'react';
import Homepage from "./components/Homepage";
import Settings from "./components/Settings";

const theme = {
    primary: "",
    secondary: "",
};


const PageContext = React.createContext({});

export default function App() {
    const [currentPage, setCurrentPage] = useState('home'); // Initialize with 'home' as the default page

    const changePage = () => {
        setCurrentPage(currentPage == "home" ? "settings" : "home");
    };

    return <AppContainer>
        <ThemeProvider theme={theme}>
            <PageContext.Provider value={{currentPage, changePage}}>
                <main>
                    {currentPage === 'home' ? <Homepage/> : <Settings/>}
                </main>
            </PageContext.Provider>
        </ThemeProvider>
    </AppContainer>
}

/**
 * This Calls Content Scripts (Javascript) on the backend
 * @param action The Keyword located in the index.ts of the chrome directories, these are the name of the functions to run
 * @param args The Parameters the function needs to execute
 */
export const callScript = (action: any, args = {}) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id as number, {action, ...args});
    });
};

const AppContainer = styled.div`

`
