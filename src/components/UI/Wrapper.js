import React from 'react';
import Container from '@material-ui/core/Container';

export default function Wrapper(props) {
   return (
      <Container maxWidth={props.size}>
         {props.children}
      </Container>
   )
}