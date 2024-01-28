import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {callScript} from '../CallScript';
import axios from 'axios'

export default function PromptBox() {
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [accountID, setAccountID] = useState('');
    const [FilteredDOM, setFilteredDOM] = useState([])

    // This State Holds if the microphone is currently capturing your audio
    const [capturing, setCapturing] = useState(false);
    const [prevCapturing, setPrevCapturing] = useState(false);

    // Retrieve Name from Storage
    useEffect(() => {
        const handleNameResponse = (event: any) => {
            const {detail} = event;
            if (detail.action === 'getDataFromStorage' && detail.key === 'name' && detail.status === 'success') {
                setName(detail.value || '');
            }
        };

        window.addEventListener('myExtensionResponse', handleNameResponse);
        callScript('getDataFromStorage', {key: 'name'});

        return () => {
            window.removeEventListener('myExtensionResponse', handleNameResponse);
        };
    }, []);

    // Retrieve AccountID from Storage
    useEffect(() => {
        const handleAccountIDResponse = (event: any) => {
            const {detail} = event;
            if (detail.action === 'getDataFromStorage' && detail.key === 'accountID' && detail.status === 'success') {
                setAccountID(detail.value || '');
            }
        };

        window.addEventListener('myExtensionResponse', handleAccountIDResponse);
        callScript('getDataFromStorage', {key: 'accountID'});

        return () => {
            window.removeEventListener('myExtensionResponse', handleAccountIDResponse);
        };
    }, []);

    // Get Filtered DOM from Algorithm
    useEffect(() => {
        const handleSearchNodes = (event: any) => {
            const {searchNodes} = event.detail;
            setFilteredDOM(searchNodes);
        };

        window.addEventListener('myExtensionSearchNodes', handleSearchNodes);

        return () => {
            window.removeEventListener('myExtensionSearchNodes', handleSearchNodes);
        };
    }, []);

    // Event Listener for Audio & Calling API
    useEffect(() => {
        const handleSpeechData = (event: any) => {
            const {finalTranscript, capturing} = event.detail;

            if (capturing && !prevCapturing) {
                setMessage('');
            } else {
                setMessage(finalTranscript);
                sendRequestToOpenAI(); // Call OPENAI
                console.log(accountID, name)
            }

            setPrevCapturing(capturing); // Update the previous capturing state
            setCapturing(capturing); // Update the capturing state
        };

        window.addEventListener('myExtensionSpeechData', handleSpeechData);

        return () => {
            window.removeEventListener('myExtensionSpeechData', handleSpeechData);
        };
    }, [prevCapturing, capturing]);

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
            DOM: FilteredDOM
        }

        console.log(data);

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


