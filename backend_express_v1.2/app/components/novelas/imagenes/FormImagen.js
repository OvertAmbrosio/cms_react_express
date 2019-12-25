import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Swal from "sweetalert2";  

import {
  Form, FormGroup, Label, Input, 
  Card, CardImg, CardFooter,
  Button, Col, Row
} from 'reactstrap';
//variables de la api
import ReactApi from '../../../global';
//libreria para crear slug / url
const slugify = require('slugify');
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

const FormImagen = ({accion, idNovela, tituloNovela, imagen, loading, cancelar}) => {

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-grow text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  const [titulo, setTitulo] = useState(imagen ? imagen.titulo : '');
  const [tipo, setTipo] = useState(imagen ? imagen.tipo:'Wallpaper');
  const [contentType, setContentType] = useState(imagen ? imagen.contentType:'')
  const [imageURL, setImageURL] = useState(imagen ? imagen.url: '');
  const [imageKey, setImageKey] = useState(imagen ? imagen.key: '');
  const [imgObject, setImgObject] = useState('');
  const [imagenSRC, setImagenSRC] = useState(imagen?imagenLoading:imagenBase);
  const inputTitulo = useRef(null); 

  useEffect(() => {
    if (imageURL != '') {
      setImagenSRC(imageURL);
    }
  },[imageURL]);

  useEffect(() => {
    if (tipo == "Portada" || tipo == "Miniatura") {
      let imagen_titulo = tituloNovela;
      setTitulo(imagen_titulo);
      inputTitulo.current.value=imagen_titulo;
      inputTitulo.current.disabled = true;
    } else if (tipo == "Wallpaper"){
      setTitulo(imagen?imagen.titulo:'');
      inputTitulo.current.value=imagen?imagen.titulo:'';
      inputTitulo.current.disabled = false;
    }
  },[tipo]);

  useEffect(() => {
    if (accion == "crear" && imgObject != '') {
      crearImagen();
    } else if (accion == "editar" && imgObject != '') {
      editarImagen();
    }
  },[imgObject]);

  //crear Imagen
  const crearImagen = () => {
    SWBB.fire({
      title: '¿Guardar datos de la Imagen?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ¡Subelo compa!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          onBeforeOpen: async e => {
            Swal.showLoading()
            await axios({
              method: 'post',
              url: ReactApi.url_api + '/api/imagenes',
              data: {
                data: imgObject,
                method: 'guardarImagen'
              }
            }).then((res) => {
              Swal.hideLoading();
              SWBB.fire({
                title: res.data.title,
                text: res.data.message,
                type: res.data.status
              }).then((result) => {
                if(result.value && res.data.status != "error"){
                  window.history.back();
                } 
              });
            }).catch(err => console.log(err));
          }
        })
      } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
      ) {
        SWBB.fire(
          'Cancelado',
          'Imagen no guardada',
          'error',
        )
      }
    })
  }
  //editar Imagen
  const editarImagen = () => {
    SWBB.fire({
      title: 'Actualizar datos de la Imagen?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ¡Subelo compa!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          onBeforeOpen: async e => {
            Swal.showLoading()
            await axios({
              method: 'put',
              url: ReactApi.url_api + '/api/imagenes/listar/' + imagen._id,
              data: {
                data: imgObject,
                oldKey: imagen.key,
                method: 'actualizarImagen'
              }
            }).then((res) => {
              Swal.hideLoading();
              SWBB.fire({
                title: res.data.title,
                text: res.data.message,
                type: res.data.status
              }).then((result) => {
                if(result.value && res.data.status != "error"){
                  window.location.href = '/cms/novelas';
                }
              });
            }).catch(err => console.log(err));
          }
        })
      } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
      ) {
        SWBB.fire(
          'Cancelado',
          'Capitulo no guardado',
          'error',
        )
      }
    })
  }
   //funcion al hacer clock en guardar-boton
  const guardarImagen = () => {
    if (imageKey && titulo) {
      const img = {
        id_novela: idNovela,
        titulo: tipo=='Portada'|| tipo=='Miniatura' ?titulo + ' ' + tipo:titulo,
        tipo: accion=='crear'?tipo:imagen.tipo,
        contentType: contentType,
        url: imageURL,
        key: accion == "crear"?imageKey:"Novelas/" + (slugify(titulo, { replacement: '-', lower: true })) + "-" + tipo
      };
      setImgObject(img);
    } else {
      Toast.fire({
        title: 'Te faltan llenar algunos campos.',
        type: 'warning'
      })
    }
  }
  //subir imagenes al aws S3 y traer respuesta
  const subirImagen = async(e) => {
    if (accion == "crear" && e.target.files[0] != undefined) {
      setContentType(e.target.files[0].type);
      let type = e.target.files[0].type;
      let name = tipo;
      let key = "Novelas/" + (slugify(titulo, { replacement: '-', lower: true })) + "-" + name;
      if (tipo == '' || titulo == '') {
        SWBB.fire({
          type: 'error',
          title: 'Oops...',
          text: '¡Primero agrega un titulo papu!'
        })
        e.target.value = null;
      } else {
        setImagenSRC(imagenLoading);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('imagen', file);
        formData.append('tipo', name);
        formData.append('Key', key);
        formData.append('type', type);
        formData.append('method', "subirImagen");
        await axios({
          method: 'post',
          url: ReactApi.url_api + '/api/imagenes',
          data: formData,
          params: { validar: true},
          processData : false,
          headers: {
            'content-type': 'multipart/form-data'
          }
        }).then((res) => {
          inputTitulo.current.disabled = true;
          if (res.data.status == "success") {
            setImagenSRC(res.data.data.Location);
            setImageURL(res.data.data.Location);
            setImageKey(res.data.data.Key)
            Toast.fire({
              type: res.data.status,
              title: res.data.message
            });
          } else if (res.data.status == "warning"){
            setImagenSRC(imagenBase);
            Toast.fire({
              type: res.data.status,
              title: res.data.message + tipo,
            });
          } else{
            setImagenSRC(imagenBase);
            Toast.fire({
              type: res.data.status,
              title: res.data.message,
            });
          }
        }).catch((err) => console.log(err));
      }
    } else if (accion == "Editar"){
      SWBB.fire({
        type: 'error',
        title: 'Oops...',
        text: '¡Edita las imagenes desde la seccion de imagenes papu!'
      });
      e.target.value = null;
    }
  }
  //cancelar operacion
  const cancelarOperacion = async(e) => {
    if (accion == 'crear') {
      if (imageKey) {
        SWBB.fire({
          title: '¿Cancelar operación?',
          text: `Se borrarán los datos no guardados.`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, ¡Vamonos compa!',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.value) {
            Swal.fire({
              onBeforeOpen: async e => {
                Swal.showLoading()
                await axios({
                  method: 'delete',
                  url: (ReactApi.url_api + '/api/imagenes/listar/' + "eliminarimagen"),
                  data: { 
                    method: "borrarImagenS3", 
                    key: imageKey}
                }).then((res) => {
                  Swal.hideLoading();
                  SWBB.fire({
                    title: res.data.title,
                    text: res.data.message,
                    type: res.data.status
                  }).then((result) => {
                    if(result.value && res.data.status == "error"){
                      console.log(res.data.errorData);
                    } else if (result.value && res.data.status == "success"){
                      console.log(res.data.messageData)
                      cancelar()
                    }
                  });
                });
              }
            })
          }else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
          ){
            SWBB.fire(
              'Cancelado',
              'Tu imagen esta segura compa',
              'error',
            )
          }
        })    
      } else {
        SWBB.fire({
          title: '¿Cancelar operación?',
          text: `Se borrarán los datos no guardados.`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, ¡Vamonos compa!',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.value) {
            cancelar();
          }else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
          ){
            SWBB.fire(
              'Cancelado',
              'Tu imagen esta segura compa',
              'error',
            )
          }
        }) 
      }
    }else if (accion == 'editar') {
      cancelar();
    }
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
              disabled={accion=="editar"}
              onChange={e => setTipo(e.target.value)}
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
            {accion=="crear"?
              <CardFooter>
                <FormGroup>
                  <Input 
                    type="file" 
                    name="imagen" 
                    id="imagen" 
                    onChange={e => subirImagen(e)}
                  />
                </FormGroup>
              </CardFooter> : ""
            }
          </Card>
        </Col>
      </Row>
      <Button color="blue-accent" onClick={guardarImagen}>Guardar</Button>
      <Button color="danger" onClick={cancelarOperacion}>Cancelar</Button>
    </Form>
  )
}

export default FormImagen
