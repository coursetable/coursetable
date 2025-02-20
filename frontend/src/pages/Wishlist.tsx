import * as Sentry from '@sentry/react';

import { Element } from 'react-scroll';
import ErrorPage from '../components/ErrorPage';
import WishlistGrid from '../components/Wishlist/WishlistGrid';

import { useWishlist } from '../contexts/wishlistContext';
import styles from './Wishlist.module.css';

function Wishlist() {
  const { wishlistLoading, wishlistError, courses } = useWishlist();

  if (wishlistError) {
    Sentry.captureException(wishlistError);
    return <ErrorPage message="There seems to be an issue with our server" />;
  }
  return (
    <div className={styles.wishlistBase}>
      <Element name="wishlist" className="d-flex justify-content-center">
        <WishlistGrid data={courses} loading={wishlistLoading} />
      </Element>
    </div>
  );
}

export default Wishlist;
