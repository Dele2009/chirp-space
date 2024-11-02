import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js'
import {
  createPost,
  editPost,
  deletePost
} from '../controllers/postController.js'
import upload from '../config/multer.js'
import { Post } from '../models/index.js'
import { ejsRenderer } from '../utilities/helpers.js'

const router = express.Router();

// Homepage (show all posts)
router.get('/', async (req, res) => {
  const posts = await Post.findAll({ include: 'User' });
  console.log(posts)
  // const tags = posts.tags
  // const maptags = tags.split(',')
  // const updatedPosts = {
  //   ...posts,
  //   tags: tags
  // }
  // console.log("this is the updated post =>", updatedPosts, tags)
  res.render('index', {
    title: 'Welcome to chirp space, #NO 1 social space for the peeps',
    posts
  });
});

// // Post creation page
// router.get('/posts/create', isAuthenticated, (req, res) => {
//   res.render('posts/createPost', {
//     title: '',
//     layout: 'layouts/user-layout'
//   });
// });

// Handle post creation (with image upload)
router.post('/posts', isAuthenticated, upload.single('post-image'), createPost);

// Post editing page
router.get('/posts/edit/:id', isAuthenticated, async (req, res) => {
  const post = await Post.findOne({ where: { id: req.params.id, userId: req.session.user.id } });
  if (!post) {
    req.flash('error_msg', 'Post not found.');
    return res.redirect('/');
  }
  // res.render('posts/editPost', { post });
  ejsRenderer.useLayout(
    res,
    "posts/editPost",
    'layouts/user-layout',
    { post }
  )
});

// Handle post editing (with image upload)
router.post('/posts/edit/:postId', isAuthenticated, upload.single('image'), editPost);

// Handle post deletion
router.post('/posts/delete/:postId', isAuthenticated, deletePost);

export default router;
