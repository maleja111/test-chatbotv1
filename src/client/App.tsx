import { response } from "express";
import React, { useState } from "react";


interface Message {
    question: string;
    response: string;
}

const App = () => {

    const [ text, setText ] = useState('');
    const [ messages, setMessages] = useState<Message[]>([]);

    const getResponse = async () => {
        try {
            if (text.length > 0) {
                const response = await fetch(`http://localhost:3000/api/database/${text}`);
                const data = await response.json();
                setMessages([...messages, { question: text, response: data.content}])
                setText("");
                console.log("data final: ", messages)
            }
            
        } catch (error) {
            console.error(error);

        }
        
    }

    return (
        <div className="chat-bot">
            <div className="header">
                <div className="info-container">
                    <h3>Chat with</h3>
                    <h2>Bookbot</h2>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#5000ca" fillOpacity="1" d="M0,160L17.1,138.7C34.3,117,69,75,103,80C137.1,85,171,139,206,165.3C240,192,274,192,309,186.7C342.9,181,377,171,411,176C445.7,181,480,203,514,218.7C548.6,235,583,245,617,213.3C651.4,181,686,107,720,74.7C754.3,43,789,53,823,85.3C857.1,117,891,171,926,208C960,245,994,267,1029,256C1062.9,245,1097,203,1131,186.7C1165.7,171,1200,181,1234,181.3C1268.6,181,1303,171,1337,165.3C1371.4,160,1406,160,1423,160L1440,160L1440,0L1422.9,0C1405.7,0,1371,0,1337,0C1302.9,0,1269,0,1234,0C1200,0,1166,0,1131,0C1097.1,0,1063,0,1029,0C994.3,0,960,0,926,0C891.4,0,857,0,823,0C788.6,0,754,0,720,0C685.7,0,651,0,617,0C582.9,0,549,0,514,0C480,0,446,0,411,0C377.1,0,343,0,309,0C274.3,0,240,0,206,0C171.4,0,137,0,103,0C68.6,0,34,0,17,0L0,0Z"></path></svg>
            </div>
            <div className="feed">
                { messages?.map( (message, index) =>
                    <div key={index}>
                    <div className="question bubble">{message.question}</div>
                    <div className="response bubble">{message.response}</div>
                    </ div>
                )}                
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)}/>
            <button onClick={getResponse}>⇨</button>
        </div>
    );
}

export default App