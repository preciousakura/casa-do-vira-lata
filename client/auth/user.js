module.exports = (req, res, next, options) => {
  const { user } = req.cookies;
  if (user) 
    if(options.allowed.includes(user.role)) return next();
  return res.render('pages/error')
};
