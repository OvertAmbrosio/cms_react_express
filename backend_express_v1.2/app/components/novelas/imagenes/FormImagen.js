import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Swal from "sweetalert2";  

import {
  Form, FormGroup, Label, Input, 
  Card, CardImg, CardFooter,
  Button, Col, Row
} from 'reactstrap'
//imagen base del thumbnail
const imagenBase = "https://s3.amazonaws.com/imagenes.tunovelaonline/tunovelaonline_base.png";
const imagenLoading = "https://s3.amazonaws.com/imagenes.tunovelaonline/loading.gif"

const SWBB = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
});
//personalizar el Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})

const FormImagen = ({accion, idNovela, tituloNovela, imagen,}) => {
  const [id] = useState(idNovela);
  const [titulo, setTitulo] = useState(imagen ? imagen.titulo : '');
  const [tituloAux, setTituloAux] = useState('');//titulo en caso de que escogar portada/miniatura
  const [tipo, setTipo] = useState(imagen ? imagen.tipo : 'Wallpaper');
  const [imageURL, setImageURL] = useState(imagen ? imagen.url: '');
  const [imgObject, setImgObject] = useState('');
  const [imagenSRC, setImagenSRC] = useState(imagen?imagenLoading:imagenBase)//usados
  const inputTitulo = useRef(null); 

  useEffect(() => {
    if (imageURL != '') {
      setImagenSRC(imageURL);
    }
  },[imageURL]);

  const cambiarTipo = async (e) => {
    setTipo(e);
    if (e == "Portada" || e == "Miniatura") {
      let imagen_titulo = tituloNovela + "-" + e;
      setTituloAux(imagen_titulo)
      inputTitulo.current.value=imagen_titulo;
      inputTitulo.current.disabled = true;
    } else {
      inputTitulo.current.value='';
      inputTitulo.current.disabled = false;
    }
  }
  //funcion al hacer clock en guardar-boton
  const guardarImagen = () => {
    if (accion == "crear") {
      crearImagen();
    }
  }
  //crear Imagen
  const crearImagen = () => {
    console.log(tituloAux);
    
  }
  return (
    <Form>
      <FormGroup row>
        <Label for="tituloNovela" sm={2}>Novela:</Label>
        <Label className="text-primary" for="tituloNovela" sm={10}><strong>{tituloNovela}</strong></Label>
      </FormGroup>
      <Row form>
        <Col md={7}>
          <FormGroup>
            <Label for="titulo">Titulo:</Label>
            <Input
              type="text"
              innerRef={inputTitulo}
              name="titulo"
              id="titulo"
              placeholder="Titulo de la imagen"
              defaultValue={titulo}
              onChange={ e => setTitulo(e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md={5}>
          <FormGroup>
            <Label for="tipo">Tipo:</Label>
            <Input 
              type="select" 
              size="1"
              name="tipo" 
              id="tipo" 
              onChange={e => cambiarTipo(e.target.value)}
              defaultValue={tipo}>
                <option value="Wallpaper">Wallpaper</option>
                <option value="Portada">Portada</option>
                <option value="Miniatura">Miniatura</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={5}>
          <Card className="my-3">
            <CardImg
              top
              src={imagenSRC}
              width="100%"
            />
            <CardFooter>
              <FormGroup>
                <Input 
                  type="file" 
                  name="imagen" 
                  id="Portada" 
                  onChange={e => console.log(e.target)}
                />
              </FormGroup>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <Button color="primary" onClick={guardarImagen}>Guardar</Button>
    </Form>
  )
}

export default FormImagen
