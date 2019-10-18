import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios';
import {
  Row, Col, Button,
  Form, FormGroup, Input, Label, CustomInput
} from 'reactstrap'

const FormNovela = ({novela}) => {

  const [tituloOrUser, setTituloOrUser] = useState('') 

  useEffect(() => {
  }, []);

  const tres = axios.get('http://localhost:4000/api/novelas/tipo');
   
  const nres = axios.get('http://localhost:4000/api/novelas/categoria');
   

  return (
    <div>
      <Form>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="novelaTitulo">Titulo</Label>
              <Input 
                plaintext 
                type="text" 
                name="titulo" 
                id="novelaTitulo" 
                defaultValue={novela.titulo}
              />
            </FormGroup>
            <FormGroup>
              <Label for="novelaTituloAlt">Titulo Alternativo</Label>
              <Input 
                plaintext 
                type="text" 
                name="tituloAlt" 
                id="novelaTituloAlt" 
                defaultValue={novela.titulo_alt}
              />
            </FormGroup>
            <FormGroup>
              <Label for="novelaAcron">Acronimo</Label>
              <Input 
                plaintext 
                type="text" 
                name="acron" 
                id="novelaAcron" 
                defaultValue={novela.acron}
              />
            </FormGroup>
            <FormGroup>
              <Label for="novelaAutor">Autor</Label>
              <Input 
                plaintext 
                type="text" 
                name="acron" 
                id="novelaAutor" 
                defaultValue={novela.autor}
              />
            </FormGroup>
            <FormGroup>
              <Label for="novelaSinopsis">Sinopsis</Label>
              <Input 
                type="textarea" 
                name="sinopsis" 
                id="novelaSinopsis" 
                defaultValue={novela.sinopsis}
              />
            </FormGroup>
            <FormGroup>
              <Label for="novelaEstado">Estado</Label>
              <Input type="select" name="novelaEstado" id="novelaEstado" value={novela.estado}>
                <option value="Emision">Emision</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Cancelado">Cancelado</option>
              </Input>
            </FormGroup>
            <Row form className="my-2">
              <Label as="legend" sm={4}>
                Tipo de Novela
              </Label>
              <Col sm={8}>
                <CustomInput
                  id="Novela China"
                  type="radio"
                  name="tipoSelected"
                  label="Novela China"
                />
              </Col>
            </Row>
          </Col>
          <Col md={6}>

          </Col>
        </Row> 
        <Button color="primary">Actualizar</Button>
      </Form>
    </div>
  )
}

FormNovela.propTypes = {
  novela: PropTypes.object
}

export default FormNovela
