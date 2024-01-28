import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import {callScript} from '../CallScript';
import axios from 'axios'
import {PageContext} from "./PageContext";
import {FilteredDOM} from "../../chrome/contentScripts/filteredDOM";

export default function PromptBox() {
    const [name, setName] = useState('');
    const [accountID, setAccountID] = useState('');
    const [filteredDOM, setFilteredDOM] = useState([]);
    const [messaging, setMessaging] = useState("");
    const [capturing, setCapturing] = useState(false);

    const {isOpen} = useContext(PageContext);

    useEffect(() => {
        const handleResponse = (event: any) => {
            const {detail} = event;
            setName(detail.value || '');
        };

        window.addEventListener('myExtensionResponse', handleResponse);
        callScript('getDataFromStorage', {key: 'name'});
        return () => window.removeEventListener('myExtensionResponse', handleResponse);
    }, [isOpen]);

    useEffect(() => {
        const handleResponse = (event: any) => {
            const {detail} = event;
            setAccountID(detail.value || '');
        };

        window.addEventListener('myExtensionResponse', handleResponse);
        callScript('getDataFromStorage', {key: 'accountID'});
        return () => window.removeEventListener('myExtensionResponse', handleResponse);
    }, [isOpen]);

    useEffect(() => {
        const handleSearchNodes = (event: any) => {
            const {searchNodes} = event.detail;
            setFilteredDOM(searchNodes || []);
        };

        window.addEventListener('myExtensionSearchNodes', handleSearchNodes);

        return () => window.removeEventListener('myExtensionSearchNodes', handleSearchNodes);
    }, [isOpen]);

    useEffect(() => {
        const handleSpeechData = (event: any) => {
            const {finalTranscript, capturing: newCapturing} = event.detail;

            // Compare the previous and new capturing states
            if (newCapturing !== capturing) {
                // Update states
                setCapturing(newCapturing);

                // Send request only when capturing changes from true to false
                if (!newCapturing) {
                    sendRequestToOpenAI(finalTranscript);
                    setMessaging(finalTranscript);
                }
            }
        };

        window.addEventListener('myExtensionSpeechData', handleSpeechData);
        return () => window.removeEventListener('myExtensionSpeechData', handleSpeechData);
    }, []);


    const sendRequestToOpenAI = (message: string) => {
        if (!accountID) {
            console.log("Account ID is null, not sending request.");
            return;
        }

        if (!FilteredDOM) {
            console.log("Filtered DOM is not Loaded");
            return;
        }

        if (!message) {
            console.log("No Message for GPT");
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

    return <PromptContainer capturing={capturing} value={messaging} onBlur={(e) => setMessaging(e.target.value)}/>
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


