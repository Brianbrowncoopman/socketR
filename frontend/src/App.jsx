import './App.css'
import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './Chat.jsx';

import { Container, Divider, Card, Icon, CardContent, Form, FormField, Button } from "semantic-ui-react";

// Configuración de URL según entorno
const SOCKET_SERVER_URL = import.meta.env.PROD
  ? "https://socketr.onrender.com"
  : "http://localhost:3001";

const socket = io.connect(SOCKET_SERVER_URL);

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if(username !== "" && room !== ""){
      socket.emit("join_room", { room, username });
      setShowChat(true);
    }
  }

  return (
    <Container style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems:'center' }}>
      { !showChat ? (
        <Card fluid style={{ width: '400px' , backgroundColor:"#EBE4E4", border:"1.5px solid #994949ff", borderRadius:"12.5px", textAlign:"center", justifyContent: 'center' }}>
          <CardContent header='Unirme al chat' />
          <CardContent>
            <Form>
              <FormField>
                <label>NOMBRE DE USUARIO:</label>
                
                <input
                  type="text" 
                  placeholder='Brian 123...' 
                  onChange={(e) => setUsername(e.target.value)} 
                  input={{
                  style: {
                    backgroundColor: "#E0D3D3",
                    borderRadius: "12.5px"  // aquí defines el fondo del input real
                  }
                }}
                  />
              </FormField>
              <FormField>
                <label>SALA:</label>
                <input 
                  type="text" 
                  placeholder='ID sala...:' 
                  onChange={(e) => setRoom(e.target.value)} 
                  input={{
                  style: {
                    backgroundColor: "#E0D3D3",
                    borderRadius: "12.5px"  // aquí defines el fondo del input real
                  }
                }}
                />
              </FormField>
              <Button onClick={joinRoom} fluid color='teal'>Unirme</Button>
            </Form>
          </CardContent>
          <CardContent extra>
            <Icon name='user' /> {/* ICONO DE USUARIO*/}
          </CardContent>
        </Card>
      ) : (
        <Chat socket={socket} username={username} room={room}/>
      )}
    </Container>
  );
}

export default App;

