import React from 'react';

import styles from './Footer.module.css';
import common_styles from '../styles/common.module.css';
import { NavLink } from 'react-router-dom';
import Logo from "./Logo"

function App() {
  return (
    <footer className={'container py-5 px-5 '+styles.footer}>
      <div className='row'>
        <div className='col-12 col-md'>
          <Logo/>
          <small className='d-block mb-3'>&copy; 2020</small>
        </div>
        <div className='col-6 col-md'>
          <h5>Explore courses</h5>
          <ul className='list-unstyled text-small'>
            <li>
              <NavLink to='/catalog'>Catalog</NavLink>
            </li>
            <li>
              <NavLink to='/worksheet'>Worksheet</NavLink>
            </li>
          </ul>
        </div>
        <div className='col-6 col-md'>
          <h5>Support</h5>
          <ul className='list-unstyled text-small'>
            <li>
              <NavLink to='/faq'>FAQ</NavLink>
            </li>
            <li>
              <NavLink to='/changelog'>Changelog</NavLink>
            </li>
            <li>
              <NavLink to='/feedback'>Feedback</NavLink>
            </li>
          </ul>
        </div>
        <div className='col-6 col-md'>
          <h5>About</h5>
          <ul className='list-unstyled text-small'>
            <li>
              <NavLink to='/about'>Team</NavLink>
            </li>
            <li>
              <NavLink to='/joinus'>Join us</NavLink>
            </li>
            <li>
              <a href='https://github.com/coursetable'>GitHub</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default App;
