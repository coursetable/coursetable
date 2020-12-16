import passport from 'passport';
import { Strategy as CasStrategy } from 'passport-cas';

passport.use(
  new CasStrategy(
    {
      ssoBaseURL: 'https://secure.its.yale.edu/cas',
      serverBaseURL: 'http://localhost:4096',
    },
    function (login, done) {
      console.log('in callback thingy');
      done(null, {
        netId: login,
      });
    }
  )
);

const casLogin = function (req, res, next) {
  console.log('attempting cas login');
  passport.authenticate('cas', function (err, user) {
    console.log('inside auth');
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error('CAS auth but no user'));
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      return res.json('wooter');
    });
  })(req, res, next);
  console.log('exiting casLogin function');
};

export default async (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/api/auth/check', (req, res) => {
    res.json('no sir');
  });

  app.get('/api/auth/cas', casLogin);
};
