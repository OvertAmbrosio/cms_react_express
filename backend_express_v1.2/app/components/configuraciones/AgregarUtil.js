import React, { useState } from 'react';
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


const AgregarUtil = ({agregar, metodo, tipo}) => {

  const [ nombre, setNombre ] = useState('');
  const [ descripcion, setDescripcion ] = useState('');
  const [ sugerencia, setSugerencia ] = useState('');

  //funcion para enviar el objeto
  const agregarobjeto = async () => {
    if (metodo === 'crearEtiqueta') {
      if (sugerencia == '') {
        Toast.fire({
          type: 'warning',
          title: 'No envies datos vacios.',
        })
      } else {
        let objeto = {
          text: sugerencia,
          slug: slugify(sugerencia, { replacement: '-', lower: true })
        }
        const res = await agregar(metodo, tipo, objeto);
        Toast.fire({
          type: res.data.status,
          title: 'Etiqueta Agregada correctamente.',
        })
      }
    } else if (metodo === 'crearCategoria' || metodo === 'crearTipo' ) {
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
        const res = await agregar(metodo, tipo, objeto);
        Toast.fire({
          type: res.data.status,
          title: `${tipo} Agregada correctamente.`,
        })
      }
    } else {
      Toast.fire({
        type: 'warning',
        title: 'Error en la aplicación.',
      })
    }
  }

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
}

export default AgregarUtil
