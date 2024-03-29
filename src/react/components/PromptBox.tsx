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
        (async () => {
            if (messaging.length !== 0) {
                const assistantID = await createAssistant();
                const threadID = await createThread(assistantID);
                await addMessageToThread(assistantID, threadID, messaging);

                const response = await runAssistantOnThread(assistantID, threadID);
                await handleAssistantResponse(assistantID, threadID);
            }
        })();
    }, [messaging]);

    const handleAssistantResponse = async (assistantID: string, threadID: string) => {
        const response = await runAssistantOnThread(assistantID, threadID);

        if (response && response.data && response.data.actions) {
            response.data.actions.forEach((actionItem: any) => {
                // Assuming actionItem has properties like 'action' and 'args'
                callScript(actionItem.action, actionItem.args);
            });
        }
    };

    const createAssistant = async () => {
        const data = {
            model: "gpt-4-turbo-preview", // Replace with your desired model
            description: "TOMMY goal is to run functions based on the DOM of the page passed in, other than the DOM a prompt will be passed in. The goal is to run functions on the DOM based on the message. This can be opening a tab or clicking on a element and passing in that elements key into the function",
            tools: [{
                type: 'function',
                function: {
                    "name": "OpenTab",
                    "description": "Opens a new browser tab. If a URL is provided, the new tab will navigate to that URL. Otherwise, an empty tab is opened. This function is useful for dynamically opening web content based on user interactions or specific conditions within a web application.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "url": {
                                "type": "string",
                                "description": "The web address (URL) to open in the new tab. If omitted, an empty tab (about:blank) is opened instead."
                            }
                        },
                        "required": []
                    }
                }
                // Parameters for OpenTab...
            },
            ],
            // Add other configuration settings as needed

        };

        try {
            const response = await axios.post(`https://api.openai.com/v1/assistants`, data, {
                headers: {
                    'Authorization': `Bearer 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`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v1',

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
                    'OpenAI-Beta': 'assistants=v1',

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
            role: "user",
            content: JSON.stringify({filteredDOM, message, name})
        };

        try {
            const response = await axios.post(`https://api.openai.com/v1/threads/${threadID}/messages`, data, {
                headers: {
                    'Authorization': `Bearer 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`,
                    'Content-Type': 'application/json',
                    'OpenAI-Beta': 'assistants=v1'
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
                    'OpenAI-Beta': 'assistants=v1',
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
                    'OpenAI-Beta': 'assistants=v1',

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


