
import './App.css'
import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './chat';

import { Container, Divider, Card, Icon, CardContent, Form, FormField, Button } from "semantic-ui-react";

// Cambia esta URL por la pública de tu backend en Render
const SOCKET_SERVER_URL = "https://socketr.onrender.com";


const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if(username !== "" && room !== ""){
      socket.emit("join_room", room);
      setShowChat(true);
      
    }
  }

  return (
    <Container>
      { !showChat ?
      <Card fluid>
        <CardContent header='Unirme al chat' />
        <CardContent>
          <Form>
            <FormField>
              <label>Username:</label>
              <input
                type="text" 
                placeholder='Brian 123...' 
                onChange={(e) => setUsername(e.target.value)} 
              /> 
            </FormField>
            <FormField>
              <label>Room:</label>
              <input 
                type="text" 
                placeholder='ID sala...:' 
                onChange={(e) => setRoom(e.target.value)} 
              />
            </FormField>
            <Button onClick={joinRoom}>Unirme </Button>
          </Form>

        </CardContent>
        <CardContent extra>
          <Icon name='user' />4 Friends
        </CardContent>
      </Card>
      :
      <Chat socket={socket} username={username} room={room}/>
  }
    </Container>
  )
}

export default App
