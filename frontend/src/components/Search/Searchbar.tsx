import React, { useState, useRef } from 'react';
import { Form, InputGroup, Button, Row } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import { Navigate } from 'react-router-dom';
import styles from './Searchbar.module.css';

/**
 * Renders search bar to search the catalog
 * @prop bar_size - string that holds width of the search bar
 */

function Searchbar({ bar_size }: { bar_size: 'sm' | 'lg' | undefined }) {
  // State that holds value to be searched
  const [value, setValue] = useState('');
  // Ref to get the value from the search bar
  const input = useRef<HTMLInputElement>(null);
  // On form submit, set value state to the searched value
  const searched: React.FormEventHandler<HTMLFormElement> = (event) => {
    // Prevent page refresh on submit
    event.preventDefault();
    setValue(input?.current?.value || '');
  };
  // If something was searched scroll to top when switching to catalog page
  if (value) {
    window.scrollTo(0, 0);
  }

  return value ? (
    // Switch to catalog if something was searched
    <Navigate to="/catalog" state={{ search_val: value }} />
  ) : (
    // Render search bar
    <Form onSubmit={searched}>
      <InputGroup>
        <Form.Control
          className={styles.search_bar}
          size={bar_size}
          type="text"
          placeholder="Search Catalog..."
          ref={input}
        />
        <InputGroup.Append className={styles.search_btn_container}>
          <Button
            type="submit"
            variant="outline-secondary"
            className={`${styles.search_btn} p-0`}
            style={{ width: bar_size === 'lg' ? '50px' : '38px' }}
          >
            <Row className="m-auto justify-content-center">
              <BsSearch size={bar_size === 'lg' ? 20 : 16} className="m-auto" />
            </Row>
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
}

export default Searchbar;
