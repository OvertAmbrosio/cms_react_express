import React, { useState, useEffect } from 'react';
import { 
  Button, Form, FormGroup, Label, Input
} from 'reactstrap';
import slugify from 'slugify';
import Swal from "sweetalert2"; 

//configuracion del Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})


const AgregarActualizar = ({funcionTipo, agregar, editar, metodo, tipo, data}) => {

  const [ nombre, setNombre ] = useState('');
  const [ descripcion, setDescripcion ] = useState('');
  const [ sugerencia, setSugerencia ] = useState('');

  useEffect(() => {
    if (funcionTipo=='editar') {
      setNombre(data.nombre);
      setDescripcion(data.descripcion);
      setSugerencia(data.sugerencia);
    }
  },[funcionTipo])

  //funcion para enviar el objeto
  const agregarobjeto = async() => {
    if (metodo.agregar === 'crearEtiqueta') {
      if (sugerencia == '') {
        Toast.fire({
          type: 'warning',
          title: 'No envies datos vacios.'
        })
      } else {
        let objeto = {
          text: sugerencia,
          id: slugify(sugerencia, { replacement: '-', lower: true })
        }
        const res = await agregar(metodo.agregar, tipo, objeto);
        Toast.fire({
          type: res.data.status,
          title: res.data.message,
        })
      }
    } else if (metodo.agregar === 'crearCategoria' || metodo.agregar === 'crearTipo' ) {
      if (nombre == '' || descripcion == '') {
        Toast.fire({
          type: 'warning',
          title: 'No envies datos vacios.'
        })
      } else {
        let objeto = {
          nombre: nombre,
          descripcion: descripcion,
          slug: slugify(nombre, { replacement: '-', lower: true })
        }
        const res = await agregar(metodo.agregar, tipo, objeto);
        Toast.fire({
          type: res.data.status,
          title: res.data.message
        })
      }
    } else {
      Toast.fire({
        type: 'warning',
        title: 'Error en la aplicación.',
      })
    }
  }

  //funcion para enviar el objeto actualizado
  const actualizarObjeto = async() => {
    if (metodo.editar === 'actualizarEtiquetas') {
      if (sugerencia == '') {
        Toast.fire({
          type: 'warning',
          title: 'No envies datos vacios.',
        })
      } else {
        let objeto = {
          text: sugerencia,
          id: slugify(sugerencia, { replacement: '-', lower: true })
        }
        const res = await editar(metodo.editar, tipo, objeto, data.id);
        Toast.fire({
          type: res.data.status,
          title: res.data.message,
        })
      }
    } else if (metodo.editar === 'actualizarCategoria' || metodo.editar === 'actualizarTipo' ) {
      if (nombre == '' || descripcion == '') {
        Toast.fire({
          type: 'warning',
          title: 'No envies datos vacios.',
        })
      } else {
        let objeto = {
          nombre: nombre,
          descripcion: descripcion,
          slug: slugify(nombre, { replacement: '-', lower: true })
        }
        const res = await editar(metodo.editar, tipo, objeto, data.id);
        Toast.fire({
          type: res.data.status,
          title: res.data.message,
        })
      }
    } else {
      Toast.fire({
        type: 'warning',
        title: 'Error en la aplicación.',
      })
    }
  }

  //retornar componente

  if (funcionTipo === 'agregar') {

    return (
      <div className='p-3'>
        {
          tipo=='etiquetas'?
          <Form inline>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="sugerencia" className="mr-sm-2">Sugerencia</Label>
              <Input type="text" name="sugerencia" id="sugerencia" onChange={e => setSugerencia(e.target.value)}/>
            </FormGroup>
            <Button color='success' onClick={agregarobjeto}>Agregar</Button>
          </Form>
          :
          <Form inline>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="nombre" className="mr-sm-2">Nombre</Label>
              <Input type="text" name="nombre" id="nombre" onChange={e => setNombre(e.target.value)}/>
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="descripcion" className="mr-sm-2">Descripción</Label>
              <Input type="text" name="descripcion" id="descripcion" onChange={e => setDescripcion(e.target.value)}/>
            </FormGroup>
            <Button color='success' onClick={agregarobjeto}>Agregar</Button>
          </Form>
        }
      </div>
    )
    
  } else if (funcionTipo === 'editar'){
    return (
      <div className='p-3'>
      {
        tipo=='etiquetas'?
        <Form inline>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="sugerencia" className="mr-sm-2">Sugerencia</Label>
            <Input type="text" name="sugerencia" id="sugerencia" defaultValue={data.sugerencia} onChange={e => setSugerencia(e.target.value)}/>
          </FormGroup>
          <Button color='success' onClick={actualizarObjeto}>Actualizar</Button>
        </Form>
        :
        <Form inline>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="nombre" className="mr-sm-2">Nombre</Label>
            <Input type="text" name="nombre" id="nombre" defaultValue={data.nombre} onChange={e => setNombre(e.target.value)}/>
          </FormGroup>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
            <Label for="descripcion" className="mr-sm-2">Descripción</Label>
            <Input type="text" name="descripcion" id="descripcion" defaultValue={data.descripcion} onChange={e => setDescripcion(e.target.value)}/>
          </FormGroup>
          <Button color='warning' onClick={actualizarObjeto}>Actualizar</Button>
        </Form>
      }
      </div>
    )
  }
}

export default AgregarActualizar
