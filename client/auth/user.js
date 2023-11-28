module.exports = async (req, res, next, options) => {
  try {
    const response = await fetch('http://localhost:3001/me', { headers: { Authorization: req.cookies.user.token } })
    const data = await response.json();
    if (response.ok) {
      if(options.allowed.includes(data.user.role)) return next();
      return res.render('pages/error')
    } else {
      return res.render('pages/error')
    } 
  } catch(err) {
    return res.render('pages/error')
  }
};
