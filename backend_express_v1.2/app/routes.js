import React from 'react';
import { Redirect } from 'react-router-dom';

//Layout
import Layout from './components/layout/Layout';

//Vistas
import Dashboard from "./views/Dashboard";
import Novelas from "./views/Novelas";
import CrearNovela from "./views/CrearNovela";
import EditarNovela from "./views/EditarNovela";
import Capitulos from "./views/Capitulos";
import ListarCapitulos from "./views/ListarCapitulos";
import CrearCapitulo from "./views/CrearCapitulo";
import Imagenes from "./views/Imagenes";
import SubirImagen from "./views/SubirImagen";

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
    path: "/cms/*",
    layout: Layout,
    component: Dashboard
  }
];