import React, { useEffect } from 'react';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { TagsContext } from '../../contexts/TagsContext';

const DefaultLayout = () => {
  useEffect(() => {
    document.getElementsByTagName('html')[0].style.backgroundColor = '#ffffff';
  }, []);

  return (
    <div>
      <NavBar />
      <Container className="mt-3">
        <TagsContext>
          <Outlet />
        </TagsContext>
      </Container>
    </div>
  );
};

export default DefaultLayout;
