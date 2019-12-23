//Layout
import Layout from './components/layout/Layout';

//Vistas
import Dashboard from "./views/Dashboard";
import Novelas from "./views/Novelas/Novelas";
import CrearNovela from "./views/Novelas/CrearNovela";
import EditarNovela from "./views/Novelas/EditarNovela";
import ConfigurarNovela from "./views/Novelas/ConfigurarNovela";
import Capitulos from "./views/Capitulos/Capitulos";
import ListarCapitulos from "./views/Capitulos/ListarCapitulos";
import CrearCapitulo from "./views/Capitulos/CrearCapitulo";
import EditarCapitulo from "./views/Capitulos/EditarCapitulo";
import Imagenes from "./views/Imagenes/Imagenes";
import SubirImagen from "./views/Imagenes/SubirImagen";
import EditarImagen from "./views/Imagenes/EditarImagen";

export default [
  {
    path: "/cms/dashboard",
    exact: true,
    layout: Layout,
    component: Dashboard
  },
  {
    path: "/cms/novelas",
    exact: true,
    layout: Layout,
    component: Novelas
  },
  {
    path: "/cms/novelas/crear",
    exact: true,
    layout: Layout,
    component: CrearNovela
  },
  {
    path: "/cms/novelas/editar/:id",
    exact: true,
    layout: Layout,
    component: EditarNovela
  },
  {
    path: "/cms/novelas/configuraciones",
    exact: true,
    layout: Layout,
    component: ConfigurarNovela
  },
  {
    path: "/cms/capitulos",
    exact: true,
    layout: Layout,
    component: Capitulos
  },
  {
    path: "/cms/capitulos/listar/:var",
    exact: true,
    layout: Layout,
    component: ListarCapitulos
  },
  {
    path: "/cms/capitulos/crear/:var",
    exact: true,
    layout: Layout,
    component: CrearCapitulo
  },
  {
    path: "/cms/capitulos/editar/:id",
    exact: true,
    layout: Layout,
    component: EditarCapitulo
  },
  {
    path: "/cms/imagenes/listar/:var",
    exact: true,
    layout: Layout,
    component: Imagenes
  },
  {
    path: "/cms/imagenes/subir/:var",
    exact: true,
    layout: Layout,
    component: SubirImagen
  },
  {
    path: "/cms/imagenes/editar/:var",
    exact: true,
    layout: Layout,
    component: EditarImagen
  },
  {
    path: "/cms/*",
    layout: Layout,
    component: Dashboard
  }
];