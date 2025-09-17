import React from 'react';
import { Icon } from 'semantic-ui-react';

const Footer = () => {
  const whatsappNumber = "+56951397667"; // Coloca tu número real de WhatsApp (con código país sin +)
  const emailAddress = "brianbrowncoopman@gmail.com"; // Tu correo real

  // URL para enviar mensaje whatsapp
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  // URL para abrir cliente email
  const mailtoUrl = `mailto:${emailAddress}`;

  return (
    <div>
      <footer  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: "15px" }}>
          <div className="container mx-auto text-center" style={{ flex: 1 }}>
            © {new Date().getFullYear()} Mi Chat Web App. Todos los derechos reservados. Desarrollado por Brian Brown 
          </div>
          
          {/* Iconos con enlaces */}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" title="Whatsapp" style={{ color: '#929693ff', fontSize: '1.5em' }}>
            <Icon name="whatsapp" />
          </a>

          <a href={mailtoUrl} target="_blank" rel="noopener noreferrer" title="Email" style={{ color: '#929693ff', fontSize: '1.5em' }}>
            <Icon name="mail" />
          </a>
      </footer>
    </div>
  );
};

export default Footer;
