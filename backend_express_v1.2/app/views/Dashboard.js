import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom'
import {
  Container, Col, Row,
  Card, CardText, CardBody,
  CardTitle, Button, Table
} from 'reactstrap'
import axios from 'axios';

import TablaUsers from '../components/dashboard/TablaUsers';

const Dashboard = () => {
  const [resumenNovelas, setResumenNovelas] = useState({});
  const [resumenCapitulos, setResumenCapitulos] = useState('');
  const [resumenUsers, setResumenUsers] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarResumenNovelas();
    cargarResumenCapitulos();
    cargarResumenUsers();    
  },[]);

  useEffect(() => {
    setLoading(false)
  }, [users])

  const cargarResumenNovelas = async () => {
    const res = await axios.get('http://localhost:4000/api/novelas');
    let resumenN = new Object;
    resumenN.emision = (res.data.filter((novela) => 
        novela.estado == "Emision")).length;
    resumenN.finalizado = (res.data.filter((novela) => 
        novela.estado == "Finalizado")).length;
    resumenN.cancelado = (res.data.filter((novela) => 
        novela.estado == "Cancelado")).length;
    resumenN.total = (res.data).length;
    
    setResumenNovelas(resumenN);
  };

  const cargarResumenCapitulos = async () => {
    const res = await axios.get('http://localhost:4000/api/capitulos');
    let resumenC = new Object;
    resumenC.aprobado = (res.data.filter((capitulo) =>
      capitulo.estado == "Aprobado")).length;
    resumenC.pendiente = (res.data.filter((capitulo) =>
      capitulo.estado == "Pendiente")).length;
    resumenC.total = (res.data).length;

    setResumenCapitulos(resumenC);
  };

  const cargarResumenUsers = async () => {
    const res = await axios.get('http://localhost:4000/api/users');
      
    let resumenU = new Object;
    resumenU.activo = (res.data.filter((user) => 
      user.state === true)).length;
    resumenU.inactivo = (res.data.filter((user) => 
      user.state === false)).length;
    resumenU.total = (res.data).length;
    
    setResumenUsers(resumenU);
    setUsers(res.data);
  }

  return (
    <Container className="p-3">
      <Row className="mb-3">
        <Col md="4">
          <Card className="bg-light text-center shadow-sm">
            <CardBody>
              <CardTitle className="text-primary">
                <h2><i className="fas fa-book"></i> Novelas</h2>
              </CardTitle>
              <CardText>
                Novelas en Emision: {resumenNovelas.emision}<br/>
                Novelas Finalizadas: {resumenNovelas.finalizado}<br/>
                Novelas Canceladas: {resumenNovelas.cancelado}<br/>
              </CardText>
              <CardText>Total Novelas: {resumenNovelas.total}</CardText>
              <Button tag={Link} to="/cms/novelas" color="blue-accent">Lista</Button>
            </CardBody>
          </Card>
        </Col>    
        <Col md="4">
          <Card className="bg-light text-center shadow-sm">
            <CardBody>
              <CardTitle className="text-primary">
                <h2><i className="far fa-copy"></i> Capitulos</h2>
              </CardTitle>
              <CardText>
                Capitulos Aprobados: {resumenCapitulos.aprobado}<br/>
                Capitulos Pendientes: {resumenCapitulos.pendiente}<br/><br/>
              </CardText>
              <CardText>Total Capitulos: {resumenCapitulos.total}</CardText>
              <Button tag={Link} to="/cms/capitulos" color="blue-accent">Lista</Button>
            </CardBody>
          </Card>
        </Col>  
        <Col md="4">
          <Card className="bg-light text-center shadow-sm">
            <CardBody>
              <CardTitle className="text-primary">
                <h2><i className="fas fa-users"></i> Users CMS</h2>
              </CardTitle>
              <CardText>
                Usuarios Activos: {resumenUsers.activo}<br/>
                Usuarios Inactivos: {resumenUsers.inactivo}<br/><br/>
              </CardText>
              <CardText>Total Users: {resumenUsers.total}</CardText>
              <Button onClick={e => alert("Funcion aun no implementada")} color="blue-accent">Lista</Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md="12">
          <Card className="p-3">
            <h3>Lista de usuarios de el CMS</h3><br/>
            <TablaUsers
              users={users}
              loading={loading}
              cargarUsers={cargarResumenUsers}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard;