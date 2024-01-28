import React, {useContext} from 'react';
import styled from 'styled-components';
import Navigation from "./Navigation";
import {PageContext} from "./PageContext";
import PromptBox from "./PromptBox";

export default function Homepage() {
    const {setOpen} = useContext(PageContext);

    return <HomepageContainer>
        <Navigation setOpen={setOpen}/>
        <CircularIcon/>
        <PromptBox/>
    </HomepageContainer>
}

// Styled components
const HomepageContainer = styled.div`
    width: 100%;
    height: 100%;
    background: ${props => props.theme.secondary};

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
`

const CircularIcon = styled.div`
    width: 100px;
    height: 100px;
    background: ${props => props.theme.text};
    border-radius: 50%;
`;
