const Post = require('../models/Post');

exports.viewCreateForm = (req, res)=>{
  res.render('create-post')
}

exports.create = function(req, res){
  let post = new Post(req.body, req.session.user._id);
  console.log("controller is firing")
  console.log("the data", req.body)
  post
    .create()
    .then(function() {
      res.send('new post created ')
    })
    .catch(function(err) {
      res.send(err)
    });
}

exports.viewPost = async function(req, res){
  try{
    let post = await Post.findPostById(req.params.id);
    res.render('postScreen', {post:post})
  } catch{
    res.render('404template')
  }
}