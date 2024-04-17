import jwt from 'jsonwebtoken';
import secret from '../secrets.js';

export function addJwtCookie(req, response, next) {
  if (req.cookies.Cookie) {
    try {
      response.locals.jwt = req.cookies.Cookie;
      const payload = jwt.verify(response.locals.jwt, secret);  // ellenorzi helyes-e a jwt
      response.locals.payload = payload;
      next();
    } catch (err) {
      response.clearCookie('Cookie');
      response.status(401);
      response.render('permission_error', { uzenet: 'Hibás cookie' });
    }
  } else {
    next();
  }
}

export function authorize(roles = ['szervezo', 'admin']) {
  return (req, response, next) => {
    if (!response.locals.jwt) {
      response.status(401);
      response.render('permission_error', { uzenet: 'Bejelentkezés szükséges az oldal megtekintéséhez' });
    } else if (!roles.includes(response.locals.payload.type)) {
      // nem megfelelo jogok
      response.status(401);
      response.render('permission_error', { uzenet: 'Nem megfelelő jogok az oldal eléréséhez' });
    } else {
      // minden rendben
      next();
    }
  };
}
