import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Row, Col, Button,
  Form, FormGroup, Input, Label, CustomInput, FormText
} from 'reactstrap'
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
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


const FormNovela = ({novela, novelaTipo, novelaCategoria, novelaEtiquetas, listar, modal}) => {

  const [titulo, setTitulo] = useState(novela.titulo);
  const [acron, setAcron] = useState(novela.acron);
  const [titulo_alt, setTitulo_alt] = useState(novela.titulo_alt);
  const [autor, setAutor] = useState(novela.autor);
  const [sinopsis, setSinopsis] = useState(novela.sinopsis);
  const [estado, setEstado] = useState(novela.estado);
  const [checkCate, setCheckCate] = useState([]);
  const [tipo, setTipo] = useState(novela.tipo);
  const [categorias, setCategorias] = useState([]);
  const [tags, setTags] = useState([]);
  const [portada, setPortada] = useState('');
  const [mini, setMini] = useState('');
  const [updateNovela, setUpdateNovela] = useState('');
  const [listo, setListo] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  

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
    setCategorias(b);
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
  const checkboxChange = (e) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    let cate = categorias.filter((c) => c.nombre != item);
    cate.push({nombre :item, valor: isChecked});
    setCategorias(cate.filter((c) => c.valor != false));
  }
  //actualizar novela
  useEffect(() => {
    if (listo==true) {
      submit();
    }
  },[listo]);

  const enviarObjeto = () => {
    let Novela = {
      titulo: titulo,
      acron: acron,
      titulo_alt: titulo_alt,
      autor: autor,
      sinopsis: sinopsis,
      estado: estado,
      tipo: tipo,
      categorias: categorias,
      etiquetas: tags,
      p: novela.imagen_portada,
      m: novela.imagen_mini
    };
    setUpdateNovela(Novela);
    setListo(true)
  }

  async function submit() {
    let Novela = new FormData();
    swalWithBootstrapButtons.fire({
      title: '¿Guardar Cambios?',
      text: 'Actualizar novela "' + novela.titulo + '".',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ¡Actualizar compa!',
      cancelButtonText: 'Cancelar',
      onOpen: () => {
        console.log("preparando variables");
        Novela.append('portada', portada);
        Novela.append('mini', mini);
        Novela.append('novela', JSON.stringify(updateNovela));
      }
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          onBeforeOpen: async e => {
            Swal.showLoading()
            console.log(Novela);
            await axios({
              method: 'put',
              url: 'http://localhost:4000/api/novelas/buscar/' + novela._id,
              data: Novela,
              processData : false,
              headers: {
                'content-type': 'multipart/form-data'
              }
            }).then((res) => {
              Swal.hideLoading()
              console.log(res.data.message);
              Swal.fire({
                title: res.data.title,
                text: res.data.message,
                type: res.data.status
              }).then((result) => {
                if(result.value){
                  setListo(false);
                  listar();
                  modal();
                }
              });
            });
          }
        })
      }else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title:'Cancelado',
          text: 'Novela no guardada',
          type: 'error',
          onBeforeOpen: () => {
            setListo(false)
          }
        })
      }
      setListo(false)
    })
  }

  const actualizarNovela = (e) => {
    e.preventDefault();
    enviarObjeto();
  }
  return (
    <div>
      <Form onSubmit={actualizarNovela}>
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
                onChange={e => setTitulo(e.target.value)}
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
                onChange={e => setTitulo_alt(e.target.value)}
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
                onChange={e => setAcron(e.target.value)}
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
                onChange={e => setAutor(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="novelaSinopsis">Sinopsis</Label>
              <Input 
                type="textarea" 
                name="sinopsis" 
                id="novelaSinopsis" 
                defaultValue={novela.sinopsis}
                onChange={e => setSinopsis(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="novelaEstado">Estado</Label>
              <Input 
              type="select" 
              onChange={e => setEstado(e.target.value)}
              name="novelaEstado" 
              id="novelaEstado" 
              defaultValue={novela.estado}>
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
                      defaultValue={nTipo.nombre}
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
                  checkCate.map((nCate, i) => (
                    <CustomInput
                      type="checkbox"
                      onChange={checkboxChange}
                      name={nCate.nombre}
                      id={i}
                      key={nCate._id}
                      label={nCate.nombre}
                      defaultValue={nCate._id}
                      defaultChecked={nCate.valor}
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
                onChange={e => setPortada(e.target.files[0])}/>
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
                onChange={e => setMini(e.target.files[0])}/>
              <FormText className="text-muted">
                Agregar imagen de portada 150x150
              </FormText>
            </FormGroup>
          </Col>
        </Row> 
        <Button type="submit" color="primary">Actualizar</Button>
      </Form>
    </div>
  )
}

FormNovela.propTypes = {
  novela: PropTypes.object,
  novelaTipo: PropTypes.array,
  novelaCategoria: PropTypes.array,
  listar: PropTypes.func
}

export default FormNovela
