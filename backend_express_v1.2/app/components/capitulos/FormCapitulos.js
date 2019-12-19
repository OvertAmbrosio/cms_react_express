import React, { useState, useEffect, useRef } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios'
import Swal from "sweetalert2";  
import {
  Form, FormGroup, Label, Input, 
  Button, Col
} from 'reactstrap'
//variables de la api
import ReactApi from '../../global';

const SWBB = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

const FormCapitulos = ({accion, idNovela, usuario, tituloNovela, capitulo, modal, listar}) => {
  const [id] = useState(idNovela);
  const [traductor, setTraductor] = useState(usuario ? usuario : capitulo.traductor);
  const [titulo, setTitulo] = useState(capitulo ? capitulo.titulo : '');
  const [numero, setNumero] = useState(capitulo ? capitulo.numero : 0);
  const [estado, setEstado] = useState(capitulo ? capitulo.estado : 'Aprobado');
  const [notaTraductor, setNotaTraductor] = useState(capitulo ? capitulo.nota : '');
  const [contenido, setContenido] = useState(capitulo ? capitulo.contenido : '');
  const [capObject, setCapObject] = useState('')
  const [listo, setListo] = useState('')
  const inputTitulo = useRef(null);
  const inputNumero = useRef(null);
  const selectEstado = useRef(null);
  //efecto para poner el cursor en el input del titulo
  useEffect(() => {    
    inputTitulo.current.focus();
  },[id]);
  //efecto para ejecutar la funcion de guardar/editar cuando cambia el estado de listo
  useEffect(() => {    
    if (listo == 1 && accion == "crear") {
      guardarCapitulo();
      setListo(0);
    } else if (listo == 1 && accion == "editar") {
      editarCapitulo();
      setListo(0)
    }
  },[listo]);

  const limpiarInputs = () => {
    inputTitulo.current.value = '';
    inputNumero.current.value = Number(numero) + 1;
    selectEstado.current.value = "Aprobado";
    setNumero(Number(numero) + 1);
    setContenido('');
  }

  const crearCapitulo = (e) => {
    e.preventDefault();
    let Capitulo = new Object();
    Capitulo.id_novela = id;
    Capitulo.titulo = titulo;
    Capitulo.numero = numero;
    Capitulo.estado = estado;
    Capitulo.nota = notaTraductor;
    Capitulo.contenido = contenido;
    Capitulo.traductor = traductor;
    Capitulo.slug = "capitulo-" + numero;
    setCapObject(Capitulo);
    setListo(1)
  }

  const guardarCapitulo = () => {
    SWBB.fire({
      title: '¿Guardar Capitulo?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ¡Subelo compa!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          onBeforeOpen: async () => {
            Swal.showLoading()
            await axios({
              method: 'post',
              url: ReactApi.url_api + '/api/capitulos',
              data: {
                method: 'crearCapitulo',
                data:capObject
              }
            }).then((res) => {
              Swal.hideLoading()
              Swal.fire({
                title: res.data.title,
                text: res.data.message,
                type: res.data.status
              }).then((result) => {
                if(result.value && res.data.status != "error"){
                  limpiarInputs();
                }
              });
            });
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

  const editarCapitulo = () => {
    SWBB.fire({
      title: '¿Actualizar Capitulo?',
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
              url: ReactApi.url_api + '/api/capitulos/buscar/' + capitulo._id,
              data: {
                method: 'actualizarCapitulo',
                data: capObject
              }
            }).then((res) => {
              Swal.hideLoading()
              Swal.fire({
                title: res.data.title,
                text: res.data.message,
                type: res.data.status
              }).then((result) => {
                if(result.value){
                  listar();
                  modal();
                }
              });
            });
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
  
  return (
    <Form>
      <FormGroup row>
        <Label for="tituloNovela" sm={2}>Novela:</Label>
        <Label className="text-primary" for="tituloNovela" sm={10}><strong>{tituloNovela}</strong></Label>
      </FormGroup>
      <FormGroup row>
        <Label for="traductor" sm={2}>Traductor</Label>
        <Col sm={10}>
          <Input
            type="text"
            name="traductor"
            id="traductor"
            placeholder="Nombre del Traductor"
            defaultValue={traductor}
            onChange={e => setTraductor(e.target.value)}
          />
        </Col>
      </FormGroup>
      <FormGroup>
        <Label for="titulo">Titulo:</Label>
        <Input
          type="text"
          name="titulo"
          id="titulo"
          placeholder="Titulo del Capitulo"
          innerRef={inputTitulo}
          defaultValue={titulo}
          onChange={ e => setTitulo(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="numero">N° Capitulo:</Label>
        <Input
          type="number"
          name="numero"
          id="numero"
          innerRef={inputNumero}
          placeholder="N° de Capitulo"
          defaultValue={numero == 0 ? '': numero}
          onChange={ e => setNumero(e.target.value) }
        />
      </FormGroup>
      <FormGroup>
        <Label for="contenido">Contenido del Capitulo:</Label>
        <CKEditor
          data={contenido}
          id="contenido"
          editor={ ClassicEditor }
          onChange={ ( event, editor ) => {
              const data = editor.getData();
              setContenido(data);
          } }
        />
      </FormGroup>
      <FormGroup>
        <Label for="estado">Estado:</Label>
        <Input 
          type="select" 
          size="1"
          name="estado" 
          id="estado" 
          innerRef={selectEstado}
          onChange={e => setEstado(e.target.value)}
          defaultValue={estado}>
            <option value="Aprobado">Aprobado</option>
            <option value="Pendiente">Pendiente</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="nota">Nota del Traductor:</Label>
        <Input
          type="textarea"
          name="nota"
          id="nota"
          size="3"
          defaultValue={notaTraductor}
          onChange={e => setNotaTraductor(e.target.value)}
        />
      </FormGroup>
      <Button onClick={crearCapitulo} color="primary">Guardar</Button>
    </Form>
  )
}

export default FormCapitulos
