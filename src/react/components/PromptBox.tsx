import styled from "styled-components"

export default function PromptBox() {
    return <PromptContainer></PromptContainer>
}

const PromptContainer = styled.div`
    width: 80%;
    border-radius: 10px;
    flex: 0.45;
    margin: 2rem;
    background: ${props => props.theme.primary};
    color: ${props => props.theme.accent};
`