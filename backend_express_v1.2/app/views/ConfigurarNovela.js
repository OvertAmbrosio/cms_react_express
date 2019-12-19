import React, {useState, useEffect} from 'react';
import axios from 'axios';
//componentes
import MapaVacio from '../components/configuraciones/MapaVacio';
import Configuraciones from '../components/configuraciones/Configuraciones';
import ReactApi from '../global';

const ConfigurarNovela = () => {
  const [ loading, setLoading ] = useState('');
  const [ utilsNovela, setUtilsNovela ] = useState('');

  useEffect(() => {
    cargarUtils();
  }, []);

  const cargarUtils = async () => {
    setLoading(true);
    axios.get(ReactApi.url_api + '/api/novelas/utils' , {
      params: {
        method: 'getAll'
      }
    })
    .then(function (res) {
      setUtilsNovela(res.data);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      setLoading(false);
    });
  }
  //agregar objeto
  async function agregarObjeto (metodo, tipo, data) {
    let respuesta = ''
    await axios.post(ReactApi.url_api + '/api/novelas/utils' , {
                id_mapa: utilsNovela[0]._id,
                method: metodo,
                [tipo]: data
              })
              .then((res) => {
                respuesta = res
                cargarUtils()
              })
              .catch((error) => {
                respuesta = 'error'
                console.log(error);
              })

    return respuesta;
  }
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-grow text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  } else if (!loading && utilsNovela.length === 0) {
    return (
      <MapaVacio/>
    )
  } else {
    return (
      <Configuraciones 
        utilsNovela={utilsNovela}
        agregarObjeto={agregarObjeto}  
      />
    )
  }
  
}

export default ConfigurarNovela
