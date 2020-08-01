import React, { useState, useRef, useEffect } from 'react';
import { Form, InputGroup, Button, Row } from 'react-bootstrap';
import styles from './Searchbar.module.css';
import { BsSearch } from 'react-icons/bs';
import { Redirect } from 'react-router-dom';

function Searchbar({ bar_size }) {
  const [value, setValue] = useState('');
  let input = useRef();
  const searched = (event) => {
    event.preventDefault();
    // console.log(input.current.value);
    setValue(input.current.value);
  };
  if (value) {
    window.scrollTo(0, 0);
  }

  return value ? (
    <Redirect to={{ pathname: '/catalog', state: { search_val: value } }} />
  ) : (
    <Form onSubmit={searched}>
      <InputGroup>
        <Form.Control
          className={styles.search_bar}
          size={bar_size}
          type="text"
          placeholder="Find a class..."
          ref={input}
        />
        <InputGroup.Append className={styles.search_btn_container}>
          <Button
            type="submit"
            variant="outline-secondary"
            className={styles.search_btn + ' p-0'}
            style={{ width: bar_size === 'lg' ? '50px' : '35px' }}
          >
            <Row className="m-auto justify-content-center">
              <BsSearch size={bar_size === 'lg' ? 20 : 15} className="m-auto" />
            </Row>
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
}

export default Searchbar;
