import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from 'axios';
import { WithContext as ReactTags } from 'react-tag-input';
import { 
  Row, Col, Button, 
  Card, CardBody, CardHeader,
  Form, FormGroup, Label, Input, FormText, CustomInput
} from 'reactstrap';
import "regenerator-runtime/runtime";

import Swal from "sweetalert2";  

const slugify = require('slugify');

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})


class CrearNovela extends Component {
  constructor(props) {
    
    super(props);
    
    this.state = {
      titulo: '',
      acron: '',
      titulo_alt: '',
      autor: '',
      sinopsis: '',
      estado: 'Emision',
      tipos: [],
      tipoSelected: '',
      categorias: [],
      checkedItems: new Map(),
      tags: [],
      suggestions: [],
      portada: null,
      mini: null,
      createdBy: ''
    };
  
    this.handleChange = this.handleChange.bind(this);
    //etiquetaFuncioones
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    //subir datos
    this.onSubmit = this.onSubmit.bind(this);
  };

  async componentDidMount() {
    const { user } = this.props.auth;
    this.setState({
      createdBy: user.name
    })
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
    const tags = await axios.get('http://localhost:4000/api/novelas/etiquetas');
    if (tags.data.length > 0) {
      this.setState({
        suggestions: tags.data,
      })
    }
  }
  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  subirImagen = (e) => {
    this.setState({
      [e.target.name]: e.target.files[0]
    });
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
    let file = []; //array de imagenes
    let aux = this.state.checkedItems; //array de categorias en el estaodo
    let nCate = []; //array de categorias por organizar
    let formData = new FormData(); //variable para enviar los datos
    //empieza el sweetalert
    swalWithBootstrapButtons.fire({
      title: 'Guardar Novela?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ¡Subelo compa!',
      cancelButtonText: 'Cancelar',
      onBeforeOpen: () =>{
        console.log("preparando variables");
        file.push(this.state.portada);//imagen de portada
        file.push(this.state.mini);//imagen de miniatura
        //preparando categorias
        for (let a of aux) {
          if (aux.get(a[0]) == true) {
            nCate.push({nombre: a[0], value: "true"})
          }
        };
        console.log(nCate)
        //agregando las imagenes 
        formData.append('portada', this.state.portada);
        formData.append('mini', this.state.mini);
        //creando la data
        let nuevaNovela = {
          titulo: this.state.titulo,
          acron: this.state.acron,
          titulo_alt: this.state.titulo_alt,
          autor: this.state.autor,
          sinopsis: this.state.sinopsis,
          estado: this.state.estado,
          tipo: this.state.tipoSelected,
          categorias: nCate,
          etiquetas: this.state.tags,
          createdBy: this.state.createdBy
        };
        //agregando la data a la variable principal 
        formData.append('novela', JSON.stringify(nuevaNovela));

      }
    }).then((result) => {
      if (result.value) {
        if (this.state.portada == null) {
          swalWithBootstrapButtons.fire(
            'Error',
            'Porfavor agrega una imagen de portada',
            'warning',
          )
        } else if (this.state.mini == null){
          swalWithBootstrapButtons.fire(
            'Error',
            'Porfavor agrega una imagen de miniatura',
            'warning',
          )
        } else {
          Swal.fire({
            onBeforeOpen: async e => {
              Swal.showLoading()
              await axios({
                method: 'post',
                url: 'http://localhost:4000/api/novelas',
                data: formData,
                processData : false,
                headers: {
                  'content-type': 'multipart/form-data'
                }
              }).then((res) => {
                Swal.hideLoading()
                Swal.fire({
                  title: '¡Novela Creada!',
                  text: res.data,
                  type: 'success'
                }).then((result) => {
                  if(result.value){
                    window.location.href = '/';
                  }
                });
              });
            }
          })
        }
      }else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Novela no guardada',
          'error',
        )
      }
    })
  }

  render () {

    const { tags, suggestions } = this.state;
    return (
      <Row className="my-3">
        <Col m="10" sm="12">
          <div className="mb-2">
            <Link to="/novelas" className="text-decoration-none">
              <i className="fas fa-arrow-left text-primary"></i>{` `}Lista
            </Link>
          </div>
          <Card>
            <CardHeader tag="h4">
              Crear nueva novela
            </CardHeader>
            <CardBody>
              <Form
                className="mt-4" 
                onSubmit={this.onSubmit}>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label htmlFor="titulo">Titulo</Label>
                      <Input onChange={this.onInputChange} id="titulo" name="titulo" autoFocus required/>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="titulo_alt">Titulo Alternativo</Label>
                      <Input onChange={this.onInputChange} id="titulo_alt" name="titulo_alt" required/>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="acron">Acrónimo</Label>
                      <Input onChange={this.onInputChange} id="acron" name="acron" required/>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="autor">Autor</Label>
                      <Input onChange={this.onInputChange} id="autor" name="autor" required/>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="sinopsis">Sinopsis</Label>
                      <Input onChange={this.onInputChange} id="sinopsis" type="textarea" size="3" name="sinopsis" required/>
                    </FormGroup>
                    <FormGroup>
                      <Label>Estado</Label>
                      <CustomInput 
                        type="select"
                        onChange={this.onInputChange}
                        id="estado"
                        name="estado">
                          <option value="Emision">Emision</option>
                          <option value="Finalizado">Finalizado</option>
                          <option value="Cancelado">Cancelado</option>
                      </CustomInput>
                    </FormGroup>
                    <Row form className="my-2">
                      <Label as="legend" sm={4}>
                        Tipo de Novela
                      </Label>
                      <Col sm={8}>
                        {
                          this.state.tipos.map(tipo => (
                            <CustomInput
                              onChange={this.onInputChange}
                              type="radio"
                              name="tipoSelected"
                              key={tipo._id}
                              label={tipo.nombre}
                              value={tipo.nombre}
                              id={tipo.nombre}
                            />
                          ))
                        }
                      </Col>
                    </Row>
                    <Row form className="my-3">
                      <Label as="legend" sm={4}>
                        Categoria de Novela
                      </Label>
                      <Col sm={8}>
                        {
                          this.state.categorias.map(categoria => (
                            <CustomInput
                              type="checkbox"
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
                    </Row>
                    <FormGroup>
                      <ReactTags
                        classNames={{
                                    tag: 'badge badge-primary m-1', 
                                    tagInputField: 'form-control',
                                    suggestions: 'ReactTags__suggestions'}}
                        tags={tags}
                        autofocus={false}
                        placeholder="Agregar Nueva Etiqueta"
                        suggestions={suggestions}
                        delimiters={delimiters}
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        handleDrag={this.handleDrag}
                        handleTagClick={this.handleTagClick}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                  <FormGroup>
                    <Label>Imagen de Portada</Label>
                    <Input  
                      type="file" 
                      name="portada"
                      onChange={this.subirImagen}
                      className=""/>
                    <FormText className="text-muted">
                      Agregar imagen de portada 300x500
                    </FormText>
                  </FormGroup>
                  <FormGroup>
                    <Label for="mini">Imagen Miniatura</Label>
                    <Input  
                      type="file" 
                      name="mini"
                      id="mini"
                      onChange={this.subirImagen}
                    />
                    <FormText className="text-muted">
                      Agregar imagen miniatura 150x150
                    </FormText>
                  </FormGroup>
                  </Col>
                </Row>
                <Button type="submit" className="my-4" color="primary">
                  Guardar
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}

CrearNovela.propTypes = {
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
)(CrearNovela);