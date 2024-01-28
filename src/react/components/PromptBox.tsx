import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import {callScript} from '../CallScript';
import axios from 'axios'
import {PageContext} from "./PageContext";
import {FilteredDOM} from "../../chrome/contentScripts/filteredDOM";
import OpenAI from 'openai';


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
        (async () => {
            if (messaging.length !== 0) {
                const assistantID = await createAssistant();
                const threadID = await createThread(assistantID);
                await addMessageToThread(assistantID, threadID, "Please reply Hello");
                await runAssistantOnThread(assistantID, threadID);
            }
        })();
    }, [messaging]);

    const createAssistant = async () => {
        const data = {
            model: "gpt-4-turbo-preview", // Replace with your desired model
            // Add other configuration settings as needed
            
        };
    
        try {
            const response = await axios.post(`https://api.openai.com/v1/assistants`, data, {
                headers: {
                    'Authorization': `Bearer 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`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta' : 'assistants=v1',

                }
            });
            console.log("Assistant Created:", response.data);
            return response.data.id; // Return the Assistant ID
        } catch (error) {
            console.error("Error creating assistant:", error);
        }
    };

    const createThread = async (assistantID: string) => {
        try {
            const response = await axios.post(`https://api.openai.com/v1/threads`, {}, {
                headers: {
                    'Authorization': `Bearer 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`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta' : 'assistants=v1',

                }
            });
            console.log("Thread Created:", response.data);
            return response.data.id; // Return the Thread ID
        } catch (error) {
            console.error("Error creating thread:", error);
        }
    };

    const addMessageToThread = async (assistantID: string, threadID: string, message: string) => {
        const data = {
            // type: "message",
            role: "user",
            content: "hey tommy say hello"
        };
    
        try {
            const response = await axios.post(`https://api.openai.com/v1/threads/${threadID}/messages`, data, {
                headers: {
                    'Authorization': `Bearer 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`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta' : 'assistants=v1'
                }
            });
            console.log("Message Added:", response.data);
        } catch (error) {
            console.error("Error adding message to thread:", error);
        }
    };

    const runAssistantOnThread = async (assistantID: string, threadID: string) => {
        try {
            const response = await axios.get(`https://api.openai.com/v1/threads/${threadID}/runs`, {
                headers: {
                    'Authorization': `Bearer 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`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta' : 'assistants=v1',
                    'assistant_id': assistantID as string,

                }
            });
            console.log("Assistant Response:", response.data);
            return response.data; // Return the response
        } catch (error) {
            console.error("Error running assistant on thread:", error);
        }
    };

    const sendRequestToOpenAI = () => {
        if (!accountID) {
            console.log("Account ID is null, not sending request.");
            return;
        }

        if (!messaging) {
            console.log("No Message for GPT");
            return;
        }

        const data = {
            prompt: {
                name: name,
                message: messaging,
                DOM: filteredDOM
            }
        };

        const assistantID = "asst_FFgL6XWJvkusRlqwVpAruk7K";
        axios.post(`https://api.openai.com/v1/assistants/${assistantID}`,
            data,
            {
                headers: {
                    'Authorization': `Bearer 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`, // Make sure your accountID is correct
                    'Content-Type': 'application/json',
                    'OpenAI-Beta' : 'assistants=v1',

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


