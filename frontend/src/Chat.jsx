import React ,{ useEffect, useState } from 'react';
import { Container, Divider, Card, CardContent, Form, FormField, Input, Button } from "semantic-ui-react";
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({socket, username, room}) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [users, setUsers] = useState([]);

    const pastelColors = [
      "#FADBD8", "#D6EAF8", "#D5F5E3", "#FCF3CF",
      "#E8DAEF", "#F9E79F", "#FDEBD0",
    ];

    const getUserColor = (username) => {
      let hash = 0;
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % pastelColors.length;
      return pastelColors[index];
    };

    const sendMessage = async () => {
      if (username && currentMessage) {
        const info = {
          message: currentMessage,
          room,
          author: username,
          time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
        };

        await socket.emit("send_message", info);
        setCurrentMessage("");
      }
    };

    useEffect(() => {
      const messageHandle = (data) => {
        setMessageList((list) => [...list, data]);
      };

      socket.on("receive_message", messageHandle);
      socket.on("users_list", (list) => {
        setUsers(list);
      });

      return () => {
        socket.off("receive_message", messageHandle);
        socket.off("users_list");
      };
    }, [socket]);

    return (
      <Container fluid style={{ display: 'flex', height: '80vh' }}>
        {/* Lista de usuarios */}
        <Card style={{ width: '250px', marginRight: '10px', overflowY: 'auto' }}>
          <CardContent>
            <b>Usuarios conectados</b>
            <Divider />
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {users.map(user => (
                <li key={user} style={{ 
                  padding: '8px', 
                  backgroundColor: getUserColor(user),
                  borderRadius: '5px',
                  marginBottom: '6px'
                }}>
                  {user}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Área de chat */}
        <Card fluid style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <CardContent header={`Chat en vivo | Sala: ${room} | Usuario: ${username}`} />
          <ScrollToBottom style={{ flex: '1 1 auto', padding: '5px', overflowY: 'auto' }}>
            <CardContent>
              {messageList.map((item, i) => (
                <div 
                  key={i} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: username === item.author ? 'flex-end' : 'flex-start',
                    marginBottom: '10px'
                  }}
                >
                  <div style={{ 
                    maxWidth: '60%', 
                    backgroundColor: getUserColor(item.author), 
                    padding: '12px 20px', 
                    borderRadius: '8px',
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                  }}>
                    <strong>{item.author}</strong> <small style={{marginLeft: 10, fontSize: '0.8em', fontWeight: 'normal'}}>{item.time}</small>
                    <div style={{ marginTop: 5 }}>{item.message}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </ScrollToBottom>
          <CardContent extra>
            <Form>
              <FormField>
                <Input 
                  action={{
                    color: 'teal',
                    labelPosition: 'right',
                    icon: 'send',
                    content: 'Enviar',
                    onClick: sendMessage,
                  }}
                  value={currentMessage}
                  type='text' 
                  placeholder='Escribe tu mensaje...' 
                  onChange={e => setCurrentMessage(e.target.value)}     
                />
              </FormField>
            </Form>
          </CardContent>
        </Card>
      </Container>
    );
}

export default Chat;