import React, {useState, useEffect} from 'react'
import {
  Table, Button, CustomInput,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, FormText
} from 'reactstrap'
import axios from 'axios'
import Moment from 'react-moment'
import Swal from "sweetalert2"; 
//personalizar estilo del sweetalert
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})
//configuracion del Toast
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})

const TablaUsers = ({users, loading, cargarUsers}) => {
  const [modal, setModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');

  const guardarUser = async () => {
    let userObject = new Object;
    userObject.name = nombre;
    userObject.email = email;
    console.log(userObject);    
    await axios({
      method: 'patch',
      url: 'http://localhost:4000/api/users/' + userId,
      data: {
        op: "updateUser",
        value: userObject
      }
    }).then((res) => {
      abrirModal();
      cargarUsers();
      if (res.data.status == "success") {
        Toast.fire({
          type: res.data.status,
          title: `El Usuario "${nombre}" fue actualizado correctamente.`,
        });
        console.log(res.data.message);        
      } else {
        Toast.fire({
          type: res.data.status,
          title: res.data.title,
        })
      }
    });
  }

  const editarUser = (user) => {
    setNombre(user.name);
    setEmail(user.email);
    setUserId(user._id)
    abrirModal();    
  }

  const actualizarEstado = async (e, idUser, name) => {
    let state = e.target.checked
    await axios({
      method: 'patch',
      url: 'http://localhost:4000/api/users/' + idUser,
      data: {
        op: "updateState",
        path: "state",
        value: state,
      }
    }).then((res) => {
      if (res.data.status == "success") {
        Toast.fire({
          type: res.data.status,
          title: `El Usuario "${name}" fue actualizado a ${state===true ? "Activo":"Inactivo"}.`,
        });
        console.log(res.data.message);        
      } else {
        Toast.fire({
          type: res.data.status,
          title: res.data.title,
        })
      }
      
    });
  }

  const borrarUser = async (idUser, name) => {
    swalWithBootstrapButtons.fire({
      title: '¿Eliminar Usuario?',
      text: `Estas borrando el usuario "${name}"`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ¡Eliminalo compa!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          onBeforeOpen: async e => {
            Swal.showLoading()
            await axios({
              method: 'delete',
              url: ('http://localhost:4000/api/users/' + idUser)
            }).then((res) => {
              Swal.hideLoading()
              Swal.fire({
                title: res.data.title,
                text: res.data.message,
                type: res.data.status
              }).then((result) => {
                if(result.value){
                  cargarUsers();
                }
              });
            });
          }
        })
      }else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
      ){
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Tu usuario esta seguro compa',
          'error',
        )
      }
    })
  }

  const abrirModal = () => {
    setModal(!modal);
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-grow text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Table hover responsive>
        <thead>
          <tr className="table-light">
            <th>#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fecha de Modificación</th>
            <th>Estado</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map((user, index) => (
              <tr className="table-light py-3" key={index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Moment format="YYYY/MM/DD"> 
                    {user.updatedAt}
                  </Moment>
                </td>
                <td>
                  <CustomInput 
                    type="switch" 
                    defaultChecked={user.state}
                    id={index}
                    name="estado"
                    color="success"
                    onChange={e => actualizarEstado(e, user._id, user.name)}
                  />
                </td>
                <td>
                  <Button 
                    title="Editar User" 
                    color="warning" 
                    onClick={() => editarUser(user)}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button 
                    title="Borrar User"
                    color="danger" 
                    onClick={() => borrarUser(user._id, user.name)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </Button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
      <Modal isOpen={modal} toggle={abrirModal} centered>
        <ModalHeader toggle={abrirModal}>Editar User</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Nombre:</Label>
              <Input
                id="nombreUser"
                type="text"
                defaultValue={nombre}
                onChange={(e) => setNombre(e.target.value)}  
              />
            </FormGroup>
            <FormGroup>
              <Label>Email:</Label>
              <Input
                id="emailUser"
                type="text"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}  
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="blue-accent" onClick={guardarUser}>Actualizar</Button>{' '}
          <Button color="danger" onClick={abrirModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default TablaUsers;
