import React, {useState, useEffect} from 'react';
import classNames from 'classnames';
import axios from 'axios';
import uuid from 'uuid-random';
//* import of components and developer packages
import './ES_Chat.scss';

const ES_Chat = () => {
    const [inputVal, setInputVal] = useState('');
    const [message, setMessage] = useState([]);

    // retrieving message content
    const inputChangeHandler = () => (e) => setInputVal(e.target.value);

    // starting a subscription to receive new messages
    useEffect(() => {
        subscribe();
    }, [])

    // sending a message to the server
    const sendMessage = async () => {
        // empty message check
        if(inputVal !== ''){
            await axios.post('http://localhost:8000/add-message', {
                message: inputVal,
                id: uuid()
            });
        }
    }

    // function to subscribe to receive new messages
    const subscribe = async  () => {
        const url = 'http://localhost:8000/connect';
        const eventSource = new EventSource(url);
        eventSource.onmessage = (e) => {
            const message = JSON.parse(e.data);
            setMessage(pr => [message, ...pr]);
        }
    }



    return (
        <div className='pl-chat'>
            <div>
                <div className="form">
                    <input type="text"
                           onInput={inputChangeHandler()}
                           value={inputVal}/>
                    <button onClick={sendMessage}>Send Message</button>
                </div>
                <div className="messages">
                    {message.map(mess => (
                        <div className='message' key={mess.id}>{mess.message}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ES_Chat;