import React, { Component } from 'react';
import axios from 'axios';
import { WithContext as ReactTags } from 'react-tag-input';
import { Form, Row, Button, Card, Col } from 'react-bootstrap';
import "regenerator-runtime/runtime";

var slugify = require('slugify')

const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria"
]


const suggestions = COUNTRIES.map((country) => {
  let slug = slugify(country, {replacement: '-', lower: true});
  return {
    id: slug,
    text: country
  }
})

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default class  CrearNovela extends Component {
  constructor(props) {
    
    super(props);
    
    this.state = {
      titulo: '',
      acron: '',
      titulo_alt: '',
      autor: '',
      sinopsis: '',
      estado: '',
      tipos: [],
      tipoSelected: '',
      categorias: [],
      checkedItems: new Map(),
      tags: [],
      suggestions: suggestions,
      file: null
    };
  
    this.handleChange = this.handleChange.bind(this);
    //etiquetaFuncioones
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
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
      })
    }
  }
  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(this.state.estado)
  }

  subirImagen = (e) => {
    this.setState({
      file: e.target.files[0]
    });
    console.log(this.state.file)
  }
//etiquetas
  handleChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({
      checkedItems: prevState.checkedItems.set(item, isChecked) 
    }));
  }

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAddition(tag) {
    let t = new Object();
    t.id = slugify(tag.id, { replacement: '-', lower: true });
    t.text = tag.text;
    this.setState(state => ({ tags: [...state.tags, t] }));
    console.log(this.state.tags)
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }
//enviar formulario
  onSubmit = async e => {
    e.preventDefault();
    const aux = this.state.checkedItems;
    let categorias = [];
    for (let a of aux) {
      if (aux.get(a[0]) == true) {
        categorias.push(a[0])
      }
    }
    let formData = new FormData();
    let file = this.state.file;
    formData.set('file', file)

    const nuevaNovela = {
      titulo: this.state.titulo,
      acron: this.state.acron,
      titulo_alt: this.state.titulo_alt,
      autor: this.state.autor,
      sinopsis: this.state.sinopsis,
      estado: this.state.estado,
      tipo: this.state.tipoSelected,
      categoria: categorias,
      etiquetas: this.state.tags,
    };

    formData.append('novela', nuevaNovela)
    console.log("hola " + formData.body);
    const res = await axios({
      method: 'post',
      url: 'http://localhost:4000/api/novelas',
      data: formData
    })
    
  }

  render () {
    const { tags, suggestions } = this.state;
    return (
      <Row>
        <Col m={10} sm={12}>
          <Card>
            <Card.Body>
              <Card.Title>Crear nueva novela</Card.Title>
              <Form
                className="mt-4" 
                onSubmit={this.onSubmit}
                encType="multipart/form-data">
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label htmlFor="titulo">Titulo</Form.Label>
                      <Form.Control onChange={this.onInputChange} id="titulo" name="titulo"/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="titulo_alt">Titulo Alternativo</Form.Label>
                      <Form.Control onChange={this.onInputChange} id="titulo_alt"/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="acron">Acrónimo</Form.Label>
                      <Form.Control onChange={this.onInputChange} id="acron"/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="autor">Autor</Form.Label>
                      <Form.Control onChange={this.onInputChange} id="autor"/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label htmlFor="sinopsis">Sinopsis</Form.Label>
                      <Form.Control onChange={this.onInputChange} id="sinopsis" as="textarea" rows="3"/>
                    </Form.Group>
                    <Form.Group controlId="estado">
                      <Form.Label>Estado</Form.Label>
                      <Form.Control 
                        as="select"
                        onChange={this.onInputChange}
                        name="estado">
                          <option value="Emision">Emision</option>
                          <option value="Finalizado">Finalizado</option>
                          <option value="Cancelado">Cancelado</option>
                      </Form.Control>
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
                            <Form.Check
                              custom
                              onChange={this.handleChange}
                              name={categoria.nombre}
                              id={categoria._id}
                              key={categoria._id}
                              label={categoria.nombre}
                              value={categoria._id}
                              checked={this.state.checkedItems.get(categoria._id)}
                              
                            />
                          ))
                        }
                      </Col>
                    </Form.Group>
                    <Form.Group>
                      <ReactTags
                        classNames={{
                                    tag: 'badge badge-primary m-1', 
                                    tagInputField: 'form-control',
                                    suggestions: 'ReactTags__suggestions'}}
                        tags={tags}
                        placeholder="Agregar Nueva Etiqueta"
                        suggestions={suggestions}
                        delimiters={delimiters}
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        handleDrag={this.handleDrag}
                        handleTagClick={this.handleTagClick}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                  <Form.Group controlId="imagen_portada">
                    <Form.Label>Imagen de Portada</Form.Label>
                    <Form.Control  
                      type="file" 
                      name="file"
                      onChange={this.subirImagen}
                      className=""/>
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group controlId="imagen_mini">
                    <Form.Label>Imagen Miniatura</Form.Label>
                    <Form.Control  
                      type="file" 
                      name="file"
                      onChange={this.subirImagen}
                      className=""/>
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>
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