import React from 'react';
import { Tabs, Tab, Container} from 'react-bootstrap'

import CrearNovela from '../components/novelas/CrearNovela';

const Novelas = () => (
  <Tabs defaultActiveKey="crear" id="tab_novelas" className="">
    <Tab eventKey="listar" title="Listar">
      <p>que hay</p>
    </Tab>
    <Tab eventKey="crear" title="Crear">
      <Container className="p-4">
        <CrearNovela/>
      </Container>
    </Tab>
  </Tabs>
)

export default Novelas;