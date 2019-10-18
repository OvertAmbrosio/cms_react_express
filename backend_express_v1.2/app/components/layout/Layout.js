import React from 'react';
import { Container} from 'reactstrap'

import TopNav from './TopNav';

const Layout = ({children}) => (
  <div>
    <TopNav/>
    <Container className="vh-100">
      {children}
    </Container>
  </div>
)

export default Layout;