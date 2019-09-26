import React from 'react';
import { Container} from 'react-bootstrap'

import TopNav from './TopNav';

const Layout = ({children}) => (
  <div>
    <TopNav/>
    <Container className="p-3   vh-100">
      {children}
    </Container>
  </div>
)

export default Layout;