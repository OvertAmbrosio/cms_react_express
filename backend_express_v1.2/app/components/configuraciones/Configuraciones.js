import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Button, 
  TabContent, TabPane, Nav, NavItem, NavLink 
} from 'reactstrap';
import classnames from 'classnames';
//componentes
import TablaUtils from './TablaUtils';

const metodoCategoria = {
  agregar:'crearCategoria',
  editar:'actualizarCategoria',
  borrar: 'borrarCategoria'
};

const metodoTipo = {
  agregar:'crearTipo',
  editar:'actualizarTipo',
  borrar: 'borrarTipo'
};

const metodoEtiqueta = {
  agregar:'crearEtiqueta',
  editar:'actualizarEtiquetas',
  borrar: 'borrarEtiqueta'
};

const Configuraciones = ({utilsNovela, agregarObjeto, actualizarObjeto, borrarObjeto}) => {

  const [activeTab, setActiveTab] = useState('1');
  const [componente, setComponente] = useState('');

  useEffect(() => {
    if (activeTab == 1) {
      setComponente(
        <TablaUtils 
          tipo='categorias' 
          metodo={metodoCategoria}
          objetos={utilsNovela[0].categorias} 
          agregar={agregarObjeto}
          editar={actualizarObjeto}
          borrar={borrarObjeto}/>
      ) 
    } else if (activeTab == 2) {
      setComponente(
        <TablaUtils 
          tipo='tipos'
          metodo={metodoTipo}
          objetos={utilsNovela[0].tipos} 
          agregar={agregarObjeto}
          editar={actualizarObjeto}
          borrar={borrarObjeto}/>
      )
    } else if (activeTab == 3) {
      setComponente(
        <TablaUtils 
          tipo='etiquetas'
          metodo={metodoEtiqueta}
          objetos={utilsNovela[0].etiquetas} 
          agregar={agregarObjeto}
          editar={actualizarObjeto}
          borrar={borrarObjeto}/>
      )
    }
  },[activeTab])

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  return (
    <Container className="bg-white py-3 px-4 shadow-sm">
      <Row className="mb-3 justify-content-between">
        <Col sm={10} md={10} className="pt-2">
          <h4>Lista de configuraciones</h4>
        </Col>
        <Col sm={2} md={2} lg={2}>
          <Button color="danger" onClick={e => console.log('no lo haga compa')}>
              <i className="fas fa-trash-alt"></i>{` `}Eliminar
          </Button>
        </Col>
      </Row>
      <div>
        <Nav tabs>
          <NavItem style={{cursor: 'pointer'}}>
            <NavLink
              className={classnames({ active: activeTab === '1' })}
              onClick={() => { toggle('1'); }}
            >
              Categorias
            </NavLink>
          </NavItem>
          <NavItem style={{cursor: 'pointer'}}>
            <NavLink
              className={classnames({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >
              Tipos
            </NavLink>
          </NavItem>
          <NavItem style={{cursor: 'pointer'}}>
            <NavLink
              className={classnames({ active: activeTab === '3' })}
              onClick={() => { toggle('3'); }}
            >
              Etiquetas
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            { componente }
          </TabPane>
          <TabPane tabId="2">
            { componente }
          </TabPane>
          <TabPane tabId="3">
            { componente }
          </TabPane>
        </TabContent>
      </div>
    </Container>
  )
}

export default Configuraciones
