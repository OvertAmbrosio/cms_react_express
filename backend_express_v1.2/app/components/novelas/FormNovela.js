import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Row, Col, Button,
  Form, FormGroup, Input, Label, CustomInput, FormText
} from 'reactstrap'
import { WithContext as ReactTags } from 'react-tag-input';
import Swal from "sweetalert2";  

//libreria para crear slug / url
const slugify = require('slugify');
//constantes para delimitar y crear etiquetas
const KeyCodes = {
  comma: 188,
  enter: 13,
};
//constante para usar las delimitantes
const delimiters = [KeyCodes.comma, KeyCodes.enter];
//personalizar el sweetalert
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})


const FormNovela = ({novela, novelaTipo, novelaCategoria, novelaEtiquetas}) => {

  const [estado, setEstado] = useState('')
  const [checkCate, setCheckCate] = useState([])
  const [tipo, setTipo] = useState('')
  const [checkedItems, setCheckedItems] = useState(new Map());
  const [suggestions, setSuggestions] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setSuggestions(novelaEtiquetas);
    setTags(novela.etiquetas);
    setTipo(novela.tipo);
    novelaChecbox(novelaCategoria, novela.categorias);
  }, []);
  //funcion para agregar el atributo "valor" a las categorias que fueron marcadas (check)
  const novelaChecbox = (a, b) => {
    let aux = a;
    a.map((a, i) => {
      for (let x = 0; x < b.length; x++) {
        if (a.nombre == b[x].nombre) {
          aux[i].valor = true;
          break;
        } else {
          aux[i].valor = false;
        }
      }
    })
    setCheckCate(aux);
  }
  //etiquetas
  const handleDelete = (i) => {
    let t = tags;
    setTags(t.filter((tag, index) => index !== i))
  }

  const handleAddition = (tag) => {
    let t = new Object();
    let a = tags;
    t.id = slugify(tag.id, { replacement: '-', lower: true });
    t.text = tag.text;
    a.push(t);
    setTags(a);
  }

  const handleDrag = (tag, currPos, newPos) => {
    const t = tags;
    const newTags = t.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    // re-render
    setTags(newTags);
  }
  //checkbox
  const checkboxChange = (event) => {
    console.log(event)
  }

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
              <Input 
              type="select" 
              onChange={e => setEstado(e.target.value)}
              name="novelaEstado" 
              id="novelaEstado" 
              value={novela.estado}>
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
                {
                  novelaTipo.map(nTipo => (
                    <CustomInput
                      onChange={e => setTipo(e.target.value)}
                      checked={nTipo.nombre === tipo}
                      type="radio"
                      name="tipoSelected"
                      key={nTipo._id}
                      label={nTipo.nombre}
                      value={nTipo.nombre}
                      id={nTipo.nombre}
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
                  checkCate.map(nCate => (
                    <CustomInput
                      type="checkbox"
                      onChange={checkboxChange}
                      name={nCate.nombre}
                      id={nCate._id}
                      key={nCate._id}
                      label={nCate.nombre}
                      value={nCate._id}
                      checked={nCate.valor}
                    />
                  ))
                }
              </Col>
            </Row>
            <FormGroup className="mb-4">
              <Label for="novelaEtiquetas">Etiquetas</Label>
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
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                handleDrag={handleDrag}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label>Imagen de Portada</Label>
              <img 
                width="100%" 
                src={novela.imagen_portada.url} 
                alt="Card image cap" 
                className="img-thumbnail"
              />
              <Input  
                type="file" 
                name="portada"
                className=""/>
              <FormText className="text-muted">
                Agregar imagen de portada 300x500
              </FormText>
            </FormGroup>
            <FormGroup>
              <Label>Imagen de Miniatura</Label>
              <img 
                width="100%" 
                src={novela.imagen_mini.url} 
                alt="Card image cap" 
                className="img-thumbnail"
              />
              <Input  
                type="file" 
                name="mini"
                className=""/>
              <FormText className="text-muted">
                Agregar imagen de portada 150x150
              </FormText>
            </FormGroup>
          </Col>
        </Row> 
        <Button color="primary">Actualizar</Button>
      </Form>
    </div>
  )
}

FormNovela.propTypes = {
  novela: PropTypes.object,
  novelaTipo: PropTypes.array,
  novelaCategoria: PropTypes.array
}

export default FormNovela
