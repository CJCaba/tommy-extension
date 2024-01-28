import React, {useContext} from 'react'
import styled from "styled-components"
import {MdClose} from 'react-icons/md';
import {FiMenu} from 'react-icons/fi';
import {PageContext} from "./PageContext";

export default function Navigation(props: { setOpen: any }) {
    const {setOpen} = props;
    const {changePage, currentPage} = useContext(PageContext);

    return <NavigationContainer>
        <StyledIcon as={MdClose} onClick={() => setOpen(false)}/>
        <StyledIcon as={FiMenu} onClick={() => changePage(currentPage === "home" ? "settings" : "home")}/>
    </NavigationContainer>

}

const StyledIcon = styled.button`
    color: ${(props) => props.theme.primary};
    font-size: 28px;
    cursor: pointer;
`;


const NavigationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: ${props => props.theme.secondary};
    width: 100%;
`;
