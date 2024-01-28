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

    const handleResponse = (event: any) => {
        const {detail} = event;
        if (detail.action === 'getDataFromStorage' && detail.status === 'success') {
            setAccountID(detail.value || '');
        } else {
            handleResponse(event);
        }
    };

    useEffect(() => {
        window.addEventListener('myExtensionResponse', handleResponse);
        callScript('getDataFromStorage', {key: 'name'});
        return () => window.removeEventListener('myExtensionResponse', handleResponse);
    }, [isOpen, name]);

    useEffect(() => {
        window.addEventListener('myExtensionResponse', handleResponse);
        callScript('getDataFromStorage', {key: 'accountID'});
        return () => window.removeEventListener('myExtensionResponse', handleResponse);
    }, [isOpen, accountID]);

    useEffect(() => {
        const handleSearchNodes = (event: any) => {
            const {searchNodes} = event.detail;
            setFilteredDOM(searchNodes || []);
        };

        window.addEventListener('myExtensionSearchNodes', handleSearchNodes);
        FilteredDOM();
        return () => window.removeEventListener('myExtensionSearchNodes', handleSearchNodes);
    }, []);

    useEffect(() => {
        const handleSpeechData = (event: any) => {
            const {finalTranscript, capturing: newCapturing} = event.detail;
            setCapturing(capturing);
            setMessaging(finalTranscript);
        };

        window.addEventListener('myExtensionSpeechData', handleSpeechData);
        return () => window.removeEventListener('myExtensionSpeechData', handleSpeechData);
    }, [isOpen, capturing, messaging]);

    useEffect(() => {
        if (messaging.length != 0) {
            sendRequestToOpenAI();
        }
    }, [messaging])

    const sendRequestToOpenAI = () => {
        if (!accountID) {
            console.log("Account ID is null, not sending request.");
            return;
        }

        if (!messaging) {
            console.log("No Message for GPT");
            return;
        }

        const engineID = ""; // Replace with actual engine ID

        const data = {
            name: name,
            prompt: messaging,
            DOM: filteredDOM
        };

        const assistantID = "asst_FFgL6XWJvkusRlqwVpAruk7K";
        axios.post(`https://api.openai.com/v1/assistants/${assistantID}/completions`,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${accountID}`, // Make sure your accountID is correct
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error("Error sending request to OpenAI:", error);
            });
    };

    return <PromptContainer capturing={capturing} value={messaging} onChange={(e) => setMessaging(e.target.value)}/>
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


