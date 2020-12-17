import passport from 'passport';
import { Strategy as CasStrategy } from 'passport-cas';

passport.use(
  new CasStrategy(
    {
      ssoBaseURL: 'https://secure.its.yale.edu/cas',
      serverBaseURL: 'https://localhost:8080',
    },
    function (login, done) {
      done(null, {
        netId: login,
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.netId);
});

passport.deserializeUser(function (netId, done) {
  done(null, {
    netId,
  });
});

const casLogin = function (req, res, next) {
  passport.authenticate('cas', function (err, user) {
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

      // TODO: use redirect parameter
      return res.redirect('/api/auth/check');
    });
  })(req, res, next);
};

export default async (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/api/auth/check', (req, res) => {
    if (req.user) {
      res.json({ auth: true, user: req.user });
    } else {
      res.json({ auth: false });
    }
  });

  app.get('/api/auth/cas', casLogin);
};
