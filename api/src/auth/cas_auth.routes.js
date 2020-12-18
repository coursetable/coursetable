import passport from 'passport';
import { Strategy as CasStrategy } from 'passport-cas';

passport.use(
  new CasStrategy(
    {
      version: 'CAS2.0',
      ssoBaseURL: 'https://secure.its.yale.edu/cas',
    },
    function (profile, done) {
      console.log('in verify', profile);
      done(null, {
        netId: profile.user,
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

      const redirect = req.query['redirect'];
      if (redirect) {
        res.redirect(`/${redirect}`);
      }

      // If no redirect is provided, simply redirect to the auth status.
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
