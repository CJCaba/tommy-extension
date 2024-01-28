import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import {callScript} from '../CallScript';
import axios from 'axios'
import {PageContext} from "./PageContext";

export default function PromptBox() {
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [accountID, setAccountID] = useState('');
    const [filteredDOM, setFilteredDOM] = useState([]);
    const [capturing, setCapturing] = useState(false);
    const [prevCapturing, setPrevCapturing] = useState(false)

    const {isOpen} = useContext(PageContext);

    useEffect(() => {
        const handleResponse = (event: any) => {
            const {detail} = event;
            if (detail.action === 'getDataFromStorage' && detail.status === 'success') {
                if (detail.key === 'name') {
                    setName(detail.value || '');
                } else if (detail.key === 'accountID') {
                    setAccountID(detail.value || '');
                }
            }
        };

        window.addEventListener('myExtensionResponse', handleResponse);
        callScript('getDataFromStorage', {key: 'name'});
        callScript('getDataFromStorage', {key: 'accountID'});

        return () => window.removeEventListener('myExtensionResponse', handleResponse);
    }, [name, accountID, isOpen]);

    useEffect(() => {
        const handleSearchNodes = (event: any) => {
            const {searchNodes} = event.detail;
            setFilteredDOM(searchNodes || []);
        };

        window.addEventListener('myExtensionSearchNodes', handleSearchNodes);

        return () => window.removeEventListener('myExtensionSearchNodes', handleSearchNodes);
    }, [filteredDOM, isOpen]);

    useEffect(() => {
        const handleSpeechData = (event: any) => {
            const {finalTranscript, capturing: newCapturing} = event.detail;

            setMessage(newCapturing && !prevCapturing ? '' : finalTranscript);

            if (newCapturing !== capturing) {
                setPrevCapturing(capturing);
                setCapturing(newCapturing);
                sendRequestToOpenAI();
            }
        };

        window.addEventListener('myExtensionSpeechData', handleSpeechData);

        return () => window.removeEventListener('myExtensionSpeechData', handleSpeechData);
    }, [prevCapturing, capturing, accountID, name]);

    const sendRequestToOpenAI = () => {
        if (!accountID) {
            console.log("Account ID is null, not sending request.");
            return;
        }

        const engineID = ""; // Replace with actual engine ID

        const data = {
            name: name,
            message: message,
            DOM: filteredDOM
        };

        console.log(data);

        axios.post(`https://api.openai.com/v1/engines/${engineID}/completions`,
            {prompt: data, max_tokens: 150},
            {
                headers: {
                    'Authorization': `Bearer ${accountID}`,
                    'Content-Type': 'application/json',
                }
            })
            .then(response => {
                console.log(response.data);
                // Process the response from OpenAI
            })
            .catch(error => {
                console.error("Error sending request to OpenAI:", error);
            });
    };

    return <PromptContainer capturing={capturing} value={message} onChange={(e) => setMessage(e.target.value)}/>
}

const PromptContainer = styled.textarea<{ capturing: boolean }>`
    width: 80%;
    border-radius: 10px;
    flex: 0.45;
    margin: 2rem;
    background: ${props => props.theme.primary};
    color: ${props => props.theme.accent};
    overflow: auto;
    resize: none;
    text-overflow: ellipsis;
    padding: 10px;
    border: none;
    line-height: 1.5;

    box-shadow: ${props => props.capturing ? '0px 0px 20px 5px rgba(0, 0, 0, 0.4)' : '0px 0px 10px 1px rgba(0, 0, 0, 0.2)'};
    transition: box-shadow 0.3s ease-in-out;
`;


