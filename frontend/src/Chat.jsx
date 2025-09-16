import React ,{ useEffect, useState } from 'react';
import { Container, Divider, Card, Icon, CardContent, Form, FormField, Button, Input } from "semantic-ui-react";
import { Message } from 'semantic-ui-react'
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({socket, username, room}) => {

    const [currentMessage, setCurrentMessage] = React.useState("");
    const [messageList, setMessageList] = React.useState([]);

    // colores pastel
    const pastelColors = [
      "#FADBD8", // rosa pastel
      "#D6EAF8", // azul pastel
      "#D5F5E3", // verde pastel
      "#FCF3CF", // amarillo pastel
      "#E8DAEF", // lavanda pastel
      "#F9E79F", // amarillo claro pastel
      "#FDEBD0", // naranja pastel
    ];

    const getUserColor = (username) => {
      let hash = 0;
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % pastelColors.length;
      return pastelColors[index];
    };

    const sendMessage = async() => {
        if (username && currentMessage) {
            const info = {
                message: currentMessage,
                room,
                author: username,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };

            await socket.emit("send_message", info);
            // elimine la actualización local del mensaje para evitar duplicados
            setCurrentMessage("");
        }
    }

    useEffect(() => {
        const messageHandle = (data) => {
            setMessageList((list) => [...list, data]);
        }

        socket.on("receive_message", messageHandle)

        return() => socket.off("receive_message", messageHandle);
    },[socket]);

    return (
      <Container>
          <Card fluid>
              <CardContent header={`Chat en vivo | Sala: ${room} | Usuario: ${username}`}/>
              <ScrollToBottom>
                  <CardContent style={{height:"400px", padding:"5px"}}>
                      {
                          messageList.map((item, i) => {
                              return (
                              <span 
                                key={i} 
                                style={{ 
                                  display: "block", 
                                  width: "100%", 
                                  textAlign: username === item.author ? "right" : "left" 
                                }}
                              >
                                  <span 
                                    style={{ 
                                      display: "inline-block",      
                                      minWidth: "180px",        
                                      maxWidth: "60%",              
                                      backgroundColor: getUserColor(item.author),  
                                      color: "#000",
                                      borderRadius: "8px",
                                      padding: "12px 20px",
                                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                                    }}
                                  >
                                    <strong>{item.author}</strong> 
                                    <small style={{marginLeft: 10, fontSize: '0.8em', fontWeight: 'normal'}}>
                                      {item.time}
                                    </small>
                                    <div style={{marginTop: 5}}>{item.message}</div>
                                  </span>
                                  <Divider />
                              </span>
                              )
                          })
                      }
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
    )
}

export default Chat