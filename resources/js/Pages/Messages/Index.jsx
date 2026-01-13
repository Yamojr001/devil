// FILE: resources/js/Pages/Messages/Index.jsx
// This is the complete and final version.

import { useState, useEffect, useRef } from 'react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { FaPaperPlane, FaEnvelope } from 'react-icons/fa';

export default function Index({ auth, conversations }) {
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messageContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    useEffect(() => {
        if (!activeConversation) return;
        const intervalId = setInterval(async () => {
            try {
                const response = await axios.get(route('api.messages.show', activeConversation.other_user_id));
                setMessages(response.data);
            } catch (error) { console.error("Polling failed:", error); }
        }, 5000);
        return () => clearInterval(intervalId);
    }, [activeConversation]);

    const selectConversation = async (conversation) => {
        setActiveConversation(conversation);
        setLoadingMessages(true);
        setMessages([]);
        try {
            const response = await axios.get(route('api.messages.show', conversation.other_user_id));
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to load conversation:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;
        try {
            const response = await axios.post(route('api.messages.store', activeConversation.other_user_id), {
                message_text: newMessage,
            });
            setMessages(prevMessages => [...prevMessages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <SidebarLayout user={auth.user} header="Messages">
            <Head title="Messages" />
            <div className="flex h-[calc(100vh-10rem)] bg-white rounded-lg shadow-md">
                <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b"><h3 className="font-bold text-lg text-gray-800">Conversations</h3></div>
                    <div className="overflow-y-auto flex-1">
                        {conversations && conversations.length > 0 ? (
                            conversations.map(convo => (
                                <div key={convo.other_user_id} onClick={() => selectConversation(convo)} className={`p-4 cursor-pointer hover:bg-gray-100 border-l-4 ${activeConversation?.other_user_id === convo.other_user_id ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}>
                                    <p className="font-semibold text-gray-900">{convo.other_user_name}</p>
                                    {/* --- THIS IS THE UI UPGRADE --- */}
                                    {convo.property_title && <p className="text-xs text-blue-600 font-semibold truncate">Re: {convo.property_title}</p>}
                                    <p className="text-sm text-gray-500 truncate">{convo.last_message}</p>
                                </div>
                            ))
                        ) : ( <div className="p-6 text-center text-gray-500">You have no conversations yet.</div> )}
                    </div>
                </div>
                <div className="hidden md:flex w-2/3 flex-col">
                    {activeConversation ? (
                        <>
                            <div className="p-4 border-b flex items-center bg-gray-50"><h3 className="font-bold text-lg text-gray-900">{activeConversation.other_user_name}</h3></div>
                            <div ref={messageContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100">
                                {loadingMessages ? <div className="text-center text-gray-500">Loading messages...</div> : (
                                    messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.sender_id === auth.user.id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs md:max-w-md p-3 rounded-lg shadow ${msg.sender_id === auth.user.id ? 'bg-blue-500 text-white' : 'bg-white'}`}>{msg.message_text}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-4 border-t bg-white">
                                <form onSubmit={sendMessage} className="flex space-x-2">
                                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300" disabled={!newMessage.trim()}><FaPaperPlane /></button>
                                </form>
                            </div>
                        </>
                    ) : ( <div className="m-auto text-center text-gray-400"><FaEnvelope className="text-6xl mx-auto" /><p className="mt-4 font-semibold">Select a conversation to start chatting.</p></div> )}
                </div>
            </div>
        </SidebarLayout>
    );
}