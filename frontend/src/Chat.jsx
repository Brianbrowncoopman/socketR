import React, { useEffect, useState, useRef } from 'react';
import { Container, Divider, Card, CardContent, Form, FormField, Input } from "semantic-ui-react";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const pastelColors = ["#FADBD8", "#D6EAF8", "#D5F5E3", "#FCF3CF", "#E8DAEF", "#F9E79F", "#FDEBD0"];

  const getUserColor = (username) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % pastelColors.length;
    return pastelColors[index];
  };

  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);
    socket.emit("typing", room);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", room);
    }, 1200);
  };

  const sendMessage = async () => {
    if (username && currentMessage) {
      const info = {
        message: currentMessage,
        room,
        author: username,
        time: new Date().toLocaleTimeString().slice(0,5)
      };
      await socket.emit("send_message", info);
      setCurrentMessage("");
      socket.emit("stop_typing", room);
    }
  };

  useEffect(() => {
    const messageHandle = (data) => setMessageList(list => [...list, data]);
    socket.on("receive_message", messageHandle);
    socket.on("users_list", setUsers);
    socket.on("typing", user => {
      if (user !== username) setTypingUsers(prev => [...new Set([...prev, user])]);
    });
    socket.on("stop_typing", user => {
      if (user !== username) setTypingUsers(prev => prev.filter(u => u !== user));
    });
    return () => {
      socket.off("receive_message", messageHandle);
      socket.off("users_list");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [socket, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList, typingUsers]);

  return (
    <Container fluid style={{ display: 'flex', height: '80vh', backgroundColor: "#E0D3D3" }}>
      
      <Card fluid style={{ width: '200px', marginTop:"14px",marginRight: '10px', overflowY: 'auto', height: '100%', textAlign:"center", justifyContent: 'center', backgroundColor:"#EBE4E4", border:"1.5px solid #994949ff", borderRadius:"12.5px" }}> 
        <CardContent >
          <b >Usuarios conectados</b>
          <Divider />
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {users.map(user => (
              <li key={user} style={{
                padding: '8px',
                backgroundColor: getUserColor(user),
                border:"1.5px solid #994949ff",
                borderRadius:"12.5px",
                marginBottom: '6px'
              }}>
                {user}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card fluid style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', textAlign:"center", justifyContent: 'center', backgroundColor:"#EBE4E4", border:"1.5px solid #994949ff", borderRadius:"12.5px" }}>
        <CardContent style={{ flex: '0 0 auto', paddingBottom: 10 }}>
          <b>Chat en vivo | Sala: {room} | Usuario: {username}</b>
            <Divider />
        </CardContent>
        <div style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {messageList.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: username === item.author ? 'flex-end' : 'flex-start',
                marginBottom: '10px',
              }}
            >
              <div style={{
                backgroundColor: getUserColor(item.author),
                maxWidth: '60%',
                padding: '12px 20px',
                
                border:"1.5px solid #994949ff",
                borderRadius:"12.5px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                color: '#222'
              }}>
                <strong>{item.author}</strong>
                <small style={{ marginLeft: 10, fontSize: '0.8em', fontWeight: 'normal' }}>{item.time}</small>
                <div style={{ marginTop: 5 }}>{item.message}</div>
              </div>
            </div>
          ))}
          {typingUsers.length > 0 && (
            <div style={{ fontStyle: 'italic', marginTop: 10, color: '#666' }}>
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'está' : 'están'} escribiendo...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <CardContent extra style={{ flex: '0 0 auto' }}>
          <Form>
            <FormField>
              <Input
                style={{
                  border: "1.5px solid #994949ff",
                  borderRadius: "12.5px",
                  backgroundColor: "#E0D3D3"
                }}
                input={{
                  style: {
                    backgroundColor: "#E0D3D3",
                    borderRadius: "12.5px"  // aquí defines el fondo del input real
                  }
                }}
                action={{
                  color: 'teal',
                  labelPosition: 'right',
                  icon: 'send',
                  content: 'Enviar',
                  onClick: sendMessage,
                  style: {
                    borderRadius: "12.5px",   
                  }
                }}
                value={currentMessage}
                type='text'
                placeholder='Escribe tu mensaje...'
                onChange={handleTyping}
                
                
              />
            </FormField>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Chat;






