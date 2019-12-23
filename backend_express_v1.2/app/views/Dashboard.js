import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom'
import {
  Container, Col, Row,
  Card, CardText, CardBody,
  CardTitle, Button, Table
} from 'reactstrap'
import axios from 'axios';
//variables de la api
import ReactApi from '../global';

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
    const res = await axios.get(ReactApi.url_api + '/api/novelas');
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
    let data = [];
    let resumenC = new Object;
    await axios.get(ReactApi.url_api + '/api/capitulos')
      .then(function (res) {
        var promises = (res.data).map(function(capitulos){
          return (capitulos.capitulos).map((c) => (
            data.push({
              id_novela: capitulos._id,
              id_cap: c._id,
              titulo_novela : capitulos.titulo,
              titulo: c.titulo,
              numero : c.numero,
              slug: c.slug,
              traductor : c.contenido[0].traductor.nombre,
              updatedAt : c.updatedAt,
              estado : c.estado
            })
          ))
        })
        
        Promise.all(promises).then(function() {
          resumenC.aprobado = (data.filter((capitulo) =>
            capitulo.estado == "Aprobado")).length;
          resumenC.pendiente = (data.filter((capitulo) =>
            capitulo.estado == "Pendiente")).length;
          resumenC.total = (data).length;
          setResumenCapitulos(resumenC);
        })
      })
      .catch(function (error) {
        console.log(error);
      })        
  };

  const cargarResumenUsers = async () => {
    const res = await axios.get(ReactApi.url_api + '/api/users');
      
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