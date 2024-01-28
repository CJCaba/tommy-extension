import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {callScript} from '../CallScript';
import axios from 'axios'

export default function PromptBox() {
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [accountID, setAccountID] = useState('');

    // Retrieve Name and AccountID from Storage
    useEffect(() => {
        const handleResponse = (event: any) => {
            const {detail} = event;
            if (detail.action === 'getDataFromStorage') {
                if (detail.key === 'name' && detail.status === 'success') {
                    setName(detail.value || '');
                } else if (detail.key === 'accountID' && detail.status === 'success') {
                    setAccountID(detail.value || '');
                }
            }
        };

        window.addEventListener('myExtensionResponse', handleResponse);

        // Fetching both name and accountID
        callScript('getDataFromStorage', {key: 'name'});
        callScript('getDataFromStorage', {key: 'accountID'});

        return () => {
            window.removeEventListener('myExtensionResponse', handleResponse);
        };
    }, []);

    // Sends Request to OpenAI
    const sendRequestToOpenAI = () => {
        if (!accountID) {
            console.log("Account ID is null, not sending request.");
            return;
        }

        // ID of the Assistant/FineTuned Model we Created
        const engineID = "";

        const data = {
            name: name,
            message: message,
            DOM: null,
        }

        // Send Request to GPT
        axios.post(`https://api.openai.com/v1/engines/${engineID}/completions`, {prompt: data, max_tokens: 150},
            {
                headers: {
                    'Authorization': `Bearer ${accountID}`,
                    'Content-Type': 'application/json',
                }
            })
            // Call Functions That GPT Wants to Run
            .then(response => {
                console.log(response.data);

                // PSEUDO CODE FOR NOW
                /* const functionsToCall = parseFunctions(response.data);
                functionsToCall.forEach((func: any) => {
                    callScript(func.name, {...func.args})
                }); */
            })
            // Any Errors will Post here
            .catch(error => {
                console.error("Error sending request to OpenAI:", error);
            });
    };

    // Call this function when Voice is Done Hearing Us
    const handleSend = () => {
        sendRequestToOpenAI();
    };

    return <PromptContainer value={message} onChange={(e) => setMessage(e.target.value)}/>
}

const PromptContainer = styled.textarea`
    width: 80%;
    border-radius: 10px;
    flex: 0.45;
    margin: 2rem;
    background: ${props => props.theme.primary};
    color: ${props => props.theme.accent};
    overflow: auto; // Allows showing a scrollbar when needed
    resize: none; // Prevents resizing
    text-overflow: ellipsis; // Adds an ellipsis if text is too long
    padding: 10px;
    border: none;
    line-height: 1.5;
`;

