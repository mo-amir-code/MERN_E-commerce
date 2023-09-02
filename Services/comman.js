const passport = require('passport')

exports.isAuth = (req, res, done) => {
    return passport.authenticate('jwt')
  }

exports.sanitizeUser = (user) => {
    return {id:user.id, role:user.role}
}

exports.cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) {
      token = req.cookies['jwt'];
  }
  // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjI2YWY3ZGE2MjYxNGNkYTI5NWUzOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjkzNjA4Nzc0fQ.wFGV37y2x82HGgJSdIJ-IJdRN4iS5OW9ZkmBD9lW7GQ'
  return token;
};