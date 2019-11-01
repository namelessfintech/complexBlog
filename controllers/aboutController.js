
exports.info = function(req,res){
  console.log(req.body)
  res.render('about-page');
}