import React, { Component } from 'react';
import axios from 'axios';
import "regenerator-runtime/runtime";
import { Form, Row, Button, Card, Col } from 'react-bootstrap';
import Checkbox from '../common/Checkbox';

export default class  CrearNovela extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tipos: [],
      tipoSelected: '',
      categorias: [],
      checkedItems: new Map(),
    }

    this.handleChange = this.handleChange.bind(this);
    
  }
  
  async componentDidMount() {
    const tres = await axios.get('http://localhost:4000/api/novelas/tipo');
    if (tres.data.length > 0) {
      this.setState({
        tipos: tres.data,
        tipoSelected: tres.data[0]._id
      })
    };
    const nres = await axios.get('http://localhost:4000/api/novelas/categoria');
    if (nres.data.length > 0) {
      this.setState({
        categorias: nres.data,
        categoriaSelected: nres.data[0]._id
      })
    }
  }
  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(this.state.categoriaSelected)
  }

  handleChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ 
      
        checkedItems: prevState.checkedItems.set(item, isChecked) 
    
      
    }));
    console.log(!!this.state.checkedItems.get(item.key))
  }

  render () {
    return (
      <Row>
        <Col m={10} sm={12}>
          <Card>
            <Card.Body>
              <Card.Title>Crear nueva novela</Card.Title>
              <Form onSubmit={this.onSubmit} className="mt-4">
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label htmlFor="titulo">Titulo</Form.Label>
                      <Form.Control onChange={this.onInputChange} id="titulo" name="titulo"/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="titulo_alt">Titulo Alternativo</Form.Label>
                      <Form.Control id="titulo_alt"/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="acron">Acrónimo</Form.Label>
                      <Form.Control id="acron"/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="autor">Autor</Form.Label>
                      <Form.Control id="autor"/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="sinopsis">Sinopsis</Form.Label>
                      <Form.Control id="sinopsis" as="textarea" rows="3"/>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label as="legend" column sm={4}>
                        Tipo de Novela
                      </Form.Label>
                      <Col sm={8}>
                        {
                          this.state.tipos.map(tipo => (
                            <Form.Check
                              custom
                              onChange={this.onInputChange}
                              type="radio"
                              name="tipoSelected"
                              key={tipo.nombre}
                              label={tipo.nombre}
                              value={tipo._id}
                              id={tipo.nombre}
                            />
                          ))
                        }
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label as="legend" column sm={4}>
                        Categoria de Novela
                      </Form.Label>
                      <Col sm={8}>
                        {
                          this.state.categorias.map(categoria => (
                            <label key={ categoria._id}>
                              {categoria.nombre}
                              <Checkbox
                                name={categoria.nombre}
                                checked="true"
                                onChange={this.handleChange}
                              />
                            </label>
                          ))
                        }
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col>
                  </Col>
                </Row>
                <Button type="submit" className="btn-primary my-4">
                  Guardar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )
  }
}