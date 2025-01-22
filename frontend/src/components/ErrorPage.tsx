import ServerError from '../images/server_error.svg';

function ErrorPage({ message }: { readonly message: string }) {
  return (
    <div className="text-center m-auto">
      <h3>{message}</h3>
      <div>
        Please file a{' '}
        <a target="_blank" href="/feedback">
          report
        </a>{' '}
        to let us know. You can also{' '}
        <a href="#!" onClick={() => window.location.reload()}>
          reload the page
        </a>{' '}
        to try again.
      </div>
      {message === 'Internal Error' && (
        <p className="text-center m-auto">
          Your browser may be outdated. We only support mainstream browsers that
          are less than 2 years old.{' '}
          <a
            href="https://www.whatismybrowser.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Check your browser version
          </a>{' '}
          and{' '}
          <a
            href="https://browsersl.ist/#q=last+2+years+and+not+dead"
            target="_blank"
            rel="noreferrer noopener"
          >
            check if your browser is in our support range
          </a>
          .
        </p>
      )}
      <img
        alt="Error"
        className="py-5"
        src={ServerError}
        style={{ width: '25%' }}
      />
    </div>
  );
}

export default ErrorPage;
