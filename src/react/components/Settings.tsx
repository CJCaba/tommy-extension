import styled from "styled-components"
import Navigation from "./Navigation";
import {useContext, useState} from "react";
import {PageContext} from "./PageContext";
import {useUserInfo} from "./UserInfoContext";

const AccountPage = () => {
    const {name, setName} = useUserInfo();

    return <Container>
        <StyledLabel>
            Name:
            <StyledInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
        </StyledLabel>
        <StyledButton>Update Account</StyledButton>
    </Container>
};

const OpenAIPage = () => {
    const {accountID, setAccountID} = useUserInfo();

    return <Container>
        <StyledLabel>
            Account ID:
            <StyledInput
                type="text"
                value={accountID}
                onChange={(e) => setAccountID(e.target.value)}
                placeholder="Account ID"
            />
        </StyledLabel>
        <StyledButton>Save Credentials</StyledButton>
    </Container>
};


const PermissionsPage = () => {
    return <p>Permissions settings go here.</p>;
};

export default function Settings() {
    const {setOpen} = useContext(PageContext);
    const [currentPage, setCurrentPage] = useState('account'); // Changed from 'main' to 'account'

    const renderPage = () => {
        switch (currentPage) {
            case 'account':
                return <AccountPage/>;
            case 'OpenAI':
                return <OpenAIPage/>;
            case 'Permissions':
                return <PermissionsPage/>;
            default:
                return <AccountPage/>;
        }
    };

    return <SettingsContainer>
        <Navigation setOpen={setOpen}/>

        <ContentContainer>
            {renderPage()}
        </ContentContainer>

        <MenuOption onClick={() => setCurrentPage('account')}>User
            Account</MenuOption> {/* Changed from 'main' to 'account' */}
        <MenuOption onClick={() => setCurrentPage('OpenAI')}>OpenAI</MenuOption>
        <MenuOption onClick={() => setCurrentPage('Permissions')}>Permissions</MenuOption>
    </SettingsContainer>
}

const SettingsContainer = styled.div`
    width: 100%;
    height: 100%;
    background: ${props => props.theme.secondary};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
`;

const MenuOption = styled.button`
    width: 80%;
    padding: 15px 20px;
    margin: 10px 0;
    background: ${props => props.theme.primary};
    color: ${props => props.theme.accent};
    border: none;
    border-radius: 10px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
`;

const ContentContainer = styled.div`
    width: 80%;
    flex: 1;
    padding: 20px;
    margin: 20px;
    background: ${props => props.theme.accent} !important;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

    & > p {
        color: ${props => props.theme.primary} !important;;
    }
`;

const StyledLabel = styled.label`
    color: ${props => props.theme.text} !important;;
    display: block;
    margin-bottom: 10px;
`;

const StyledInput = styled.input`
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid ${props => props.theme.secondary};
    border-radius: 5px;
`;

const StyledButton = styled.button`
    background-color: ${props => props.theme.primary} !important;;
    color: ${props => props.theme.accent};
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${props => props.theme.secondary} !important;;
        color: ${props => props.theme.text} !important;;
    }
`;

const Container = styled.div`
    background-color: ${props => props.theme.accent} !important;;
`;