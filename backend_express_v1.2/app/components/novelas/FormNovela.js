import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Row, Col, Button,
  Form, FormGroup, Input, Label, CustomInput,
  Card, CardHeader, CardBody, CardFooter, CardImg
} from 'reactstrap'
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import Swal from 'sweetalert2';  
//variables de la api
import ReactApi from '../../global';
//imagen base del thumbnail
const imagenBase = "https://s3.amazonaws.com/imagenes.tunovelaonline/tunovelaonline_base.png";
const imagenLoading = "https://s3.amazonaws.com/imagenes.tunovelaonline/loading.gif"
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

const FormNovela = ({novela, accion, usuario, loading}) => {

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-grow text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  const [titulo, setTitulo] = useState(novela?novela.titulo:'');
  const [acron, setAcron] = useState(novela?novela.acron:'');
  const [titulo_alt, setTitulo_alt] = useState(novela?novela.titulo_alt:'');
  const [autor, setAutor] = useState(novela?novela.autor:'');
  const [sinopsis, setSinopsis] = useState(novela?novela.sinopsis:'');
  const [estado, setEstado] = useState(novela?novela.estado:'Emision');
  const [tipo, setTipo] = useState(novela?novela.tipo:'');
  const [imagenObj, setImagenObj] = useState({Portada: '', Miniatura: ''})
  const [categorias, setCategorias] = useState(novela?novela.categorias:[]);
  const [tags, setTags] = useState(novela?novela.etiquetas:[]);
  const [novelaObj, setNovelaObj] = useState('');
  const inputTitulo = useRef(null); 
  //constantes de cate/tipo/etiquetas
  const [utilsNovela, setUtilsNovela] = useState([]);
  const [tipoNovela, setTipoNovela] = useState([]);
  const [categoriaNovela, setCategoriaNovela] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  //imagenes staticas
  const [imagenSRC, setImagenSRC] = useState({
    Portada: novela?novela.imagenes[0].url:imagenBase, 
    Miniatura: novela?novela.imagenes[1].url:imagenBase})
  
  useEffect(() => {
    llenarUtils();
  }, []);

  useEffect(() => {
    if (novela != undefined && utilsNovela.categorias != undefined) {
      novelaChecbox(novela.categorias);
    } else if (utilsNovela.categorias != undefined){
      setCategoriaNovela(utilsNovela.categorias)
    }
  },[utilsNovela])
  //funcion para llenar categorias/ tipos/ etiquetas
  const llenarUtils = async () => {
    axios.get(ReactApi.url_api + '/api/novelas/utils' , {
      params: {
        method: 'getAll'
      }
    })
    .then(function (res) {
      setUtilsNovela(res.data[0]);
      setSuggestions(res.data[0].etiquetas);
      setTipoNovela(res.data[0].tipos);
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  //llenar imagenes en editar novela
  const llenarImagenes = async () => {
    let images = (await axios.get(ReactApi.url_api + '/api/imagenes/listar/' + novela._id)).data;
    let ip = images.filter((image) => image.tipo == "Portada" );
    let im = images.filter((image) => image.tipo == "Miniatura" );
    if (ip.length>0) {
      await setImagenSRC(prevState => ({ ...prevState, Portada: ip[0].url }));
    } else {
      Toast.fire({
        type: 'error',
        title: 'No se encontró imagen de Portada'
      });
      console.log("no hay imagen de portada");
    }
    if (im.length>0) {
      await setImagenSRC(prevState => ({ ...prevState, Miniatura: im[0].url })); 
    } else {
      Toast.fire({
        type: 'error',
        title: 'No se encontró imagen Miniatura'
      });
      console.log("no hay imagen de miniatura")
    }
       
  }

  //funcion para agregar el atributo "valor" a las categorias que fueron marcadas (check)
  const novelaChecbox = async (b) => {
    const cate = await utilsNovela.categorias;
    if (Object.entries(cate).length) {
      let a = cate
      let aux = cate;
      await a.map((a, i) => {
        for (let x = 0; x < b.length; x++) {
          if (a.nombre == b[x].nombre) {
            aux[i].valor = true;
            break;
          } else {
            aux[i].valor = false;
          }
        }
      })
      setCategoriaNovela(aux);
      setCategorias(b);   
    } else {
      Toast.fire({
        type: 'error',
        title: 'No hay categorias papu'
      });
      console.log("Error en el servidor, no hay categorias")
    }     
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
    if (novelaObj != '') {
      if (accion === "Crear") {
        crearNovela();
      } else if (accion === "Editar"){
        editarNovela();
      }
    }
  },[novelaObj]);
  //crear novela
  const crearNovela = () => {
    if (novelaObj.imagenes[0] && novelaObj.imagenes[1]) {
      SWBB.fire({
          title: '¿Guardar Novela?',
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
                  url: ReactApi.url_api + '/api/novelas',
                  data: novelaObj
                }).then((res) => {
                  Swal.hideLoading()
                  console.log(res.data.dataMessages);
                  SWBB.fire({
                    title: res.data.title,
                    text: res.data.message,
                    type: res.data.status
                  }).then((result) => {
                    if(result.value && res.data.status != "error"){
                      window.location.href = '/cms/novelas';
                    } else {
                      console.log(res.data.dataError);
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
    } else {
      console.log(novelaObj)
      Toast.fire({
        type: "error",
        title: "Porfavor agrega una foto de portada y miniatura.",
      }) 
    }
  };
  //editar novela
  const editarNovela = () => {
    SWBB.fire({
      title: '¿Actualizar Novela?',
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
              url: ReactApi.url_api + '/api/novelas/buscar/' + novela._id,
              data: novelaObj
            }).then((res) => {
              Swal.hideLoading()
              SWBB.fire({
                title: res.data.title,
                text: res.data.message,
                type: res.data.status
              }).then((result) => {
                if(result.value && res.data.status != "error"){
                  window.location.href = '/cms/novelas';
                } else {
                  console.log(res.data.errorData);
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
          'Novela no guardada',
          'error',
        )
      }
    })
  }
  //crear objecto para enviar
  const guardarNovela = () => {
    let nObjecto = new Object();
    nObjecto.method = accion=="Crear"?"crearNovela":accion=="Editar"?"editarNovela":"error";
    nObjecto.titulo= titulo;
    nObjecto.titulo_alt = titulo_alt;
    nObjecto.acron = acron;
    nObjecto.autor = autor;
    nObjecto.sinopsis = sinopsis;
    nObjecto.estado = estado;
    nObjecto.tipo = tipo;
    nObjecto.categorias = categorias;
    nObjecto.etiquetas = tags;
    nObjecto.imagenes = [imagenObj.Portada, imagenObj.Miniatura];
    nObjecto.uploadedBy = {nombre:usuario, url:'www.tunovelaonline.com'};

    setNovelaObj(nObjecto);
  }
  //subir imagenes al aws S3 y traer respuesta
  const subirImagen = async(e) => {
    if (accion == "Crear" && e.target.files[0] != undefined) {
      let type = e.target.files[0].type
      let name = e.target.id
      let key = "Novelas/" + (slugify(titulo, { replacement: '-', lower: true })) + "-" + name;
      if (titulo == '') {
        SWBB.fire({
          type: 'error',
          title: 'Oops...',
          text: '¡Primero agrega un titulo papu!'
        })
        e.target.value = null;
      } else {
        setImagenSRC(prevState => ({ ...prevState, [name]: imagenLoading }));
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
          processData : false,
          headers: {
            'content-type': 'multipart/form-data'
          }
        }).then((res) => {
          setImagenSRC(prevState => ({ ...prevState, [name]: res.data.data.Location }));
          let imgAux = {
            titulo: titulo + ' ' + name,
            tipo: name,
            url: res.data.data.Location,
            key: res.data.data.Key,
            contentType: type
          }
          setImagenObj(prevState => ({ ...prevState, [imgAux.tipo]: imgAux}));
          Toast.fire({
            type: res.data.status,
            title: res.data.message,
          });
          inputTitulo.current.disabled = true;
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
  //abortar operacion novela
  const abortarNovela = async() => {
    if (imagenObj.Portada || imagenObj.Miniatura) {
      SWBB.fire({
        title: '¿Deseas Cancelar la operacion?',
        text: "Se eliminaran las imagenes y se redireccionará a la pagina de inicio.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, ¡Vamonos de aqui!',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          Swal.fire({
            html: '<b></b>',
            onBeforeOpen: async () => {
              Swal.showLoading()
              Swal.getContent().querySelector('b')
              .textContent = "Borrando novela...";
              if (imagenObj.Portada) {
                await axios({
                  method: 'delete',
                  url: (ReactApi.url_api + '/api/imagenes/listar/' + imagenObj.Portada.data.Etag),
                  data: { 
                    method: "borrarImagenS3",
                    key: imagenObj.Portada.data.key}
                }).then((res) => {
                  console.log(res)
                  if(res.data.status == "error"){
                    console.log(res.data.errorData);
                  } else {
                    Swal.getContent().querySelector('b')
                        .textContent = "Eliminando imagen de Portada...";
                  }
                });
              };
              if(imagenObj.Miniatura) {
                await axios({
                  method: 'delete',
                  url: (ReactApi.url_api + '/api/imagenes/listar/' + imagenObj.Miniatura.data.Etag),
                  data: { 
                    method: "borrarImagenS3",
                    key: imagenObj.Miniatura.data.key}
                }).then((res) => {
                  console.log(res)
                  if(res.data.status == "error"){
                    console.log(res.data.errorData);
                  } else {
                    Swal.getContent().querySelector('b')
                        .textContent = "Eliminando imagen miniatura...";
                  }
                });
              };
              Swal.getContent().querySelector('b').textContent = "¡VAMONOS RODOLFO!";
              window.location.href = '/cms/novelas';
            }
          })
        }else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
        ){
          SWBB.fire(
            'Cancelado',
            'Tu Novela esta segura compa',
            'error',
          )
        }
      })    
    } else {
      console.log("no hay imagenes que borrar");
      window.location.href = '/cms/novelas';
    }
  }

  return (
    <Card className="justify-content-center">
      <CardHeader tag="h4">
        {accion} novela
      </CardHeader>
      <CardBody>
        <p className="text-muted">*Recuerda: Si ya subiste una imagen asegurate de darle al boton de cancelar para borrarlas del servidor de lo contrario se perderá en el limbo. Nunca uses F5 o retroceder*</p>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="novelaTitulo">Titulo</Label>
                <Input 
                  innerRef={inputTitulo}
                  required
                  plaintext 
                  type="text" 
                  name="titulo" 
                  id="novelaTitulo" 
                  defaultValue={titulo}
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
                  defaultValue={titulo_alt}
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
                  defaultValue={acron}
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
                  defaultValue={autor}
                  onChange={e => setAutor(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="novelaSinopsis">Sinopsis</Label>
                <Input 
                  type="textarea" 
                  name="sinopsis" 
                  id="novelaSinopsis" 
                  defaultValue={sinopsis}
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
                defaultValue={estado}>
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
                    tipoNovela.map((nTipo, index) => (
                      <CustomInput
                        onChange={e => setTipo(e.target.value)}
                        checked={nTipo.nombre === tipo}
                        type="radio"
                        name="tipoSelected"
                        key={index}
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
                    categoriaNovela.map((nCate, i) => (
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
            <Col lg={4} md={6} sm={6}>
              <Card className="my-3">
                <CardHeader>Imagen de Portada</CardHeader>
                <CardImg
                  top
                  src={imagenSRC.Portada}
                  width="100%"
                />
                <CardFooter>
                  <FormGroup>
                    <Input 
                      type="file" 
                      name="imagen" 
                      id="Portada" 
                      onChange={e => subirImagen(e)}
                    />
                  </FormGroup>
                </CardFooter>
              </Card>
              <Card className="my-3">
                <CardHeader>Imagen Miniatura</CardHeader>
                <CardImg
                  top
                  src={imagenSRC.Miniatura}
                  width="100%"
                />
                <CardFooter>
                  <FormGroup>
                    <Input 
                      type="file" 
                      name="imagen"
                      id="Miniatura"
                      onChange={subirImagen}
                    />
                  </FormGroup>
                </CardFooter>
              </Card>
            </Col>
          </Row> 
          <Button onClick={guardarNovela} color="primary">Actualizar</Button>
          <Button onClick={abortarNovela} color="danger">Cancelar</Button>
        </Form>
      </CardBody>
    </Card>
  )
}

FormNovela.propTypes = {
  novela: PropTypes.object,
  accion: PropTypes.string
}

export default FormNovela
