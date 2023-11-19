module.exports = (req, res, next, options) => {
  const { user } = req.cookies;
  console.log(user, options)
  if (user) 
    if(options.allowed.includes(user.role)) return next();
  return res.render('pages/error')
};
