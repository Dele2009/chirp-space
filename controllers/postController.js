import { Post } from '../models'
import path from 'path'
import { uploadFileToStorage, deleteFileFromStorage } from '../utilities/firebaseAdmin'

// Create a new post with image
// export const createPost = async (req, res) => {
//      const { title, content, tags } = req.body;
//      console.log(req.body)
//      let imageUrl = '';

//      if (req.file) {
//           imageUrl = `/uploads/${req.file.filename}`;
//      }

//      try {
//           await Post.create({
//                title,
//                content,
//                tags,
//                imageUrl,
//                userId: req.session.user.id,
//           });
//           req.flash('success_msg', 'Post created successfully.');
//           res.redirect('/users/profile');
//      } catch (error) {
//           console.error(error);
//           res.status(500).send('Server Error');
//      }
// };

export const createPost = async (req, res) => {
     const { user } = req.session
     const { title, content, tags } = req.body;
     console.log(req.body);
     let imageUrl = '';

     try {
          // Upload the file to Firebase Storage if provided
          if (req.file) {
               const { buffer, mimetype, originalname } = req.file
               const chars = title.split(' ')
               // const uploadName = chars.length > 1 ? chars.join('_') : chars[0]
               const destination = `post_uploads/${user.username}_${Date.now()}_${originalname}`; // Unique filename

               imageUrl = await uploadFileToStorage({
                    fileBuffer: buffer,
                    destination,
                    mimeType: mimetype
               })
               console.log(imageUrl)
          }

          // Create the post with the image URL
          await Post.create({
               title,
               content,
               tags,
               imageUrl,
               userId: user.id,
          });

          req.flash('success_msg', 'Post created successfully.');
          res.redirect('/users/profile');
     } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
     }
};



// Edit an existing post (with image update)
export const editPost = async (req, res) => {
     const { title, content, tags } = req.body;
     let imageUrl = req.body.existingImage;

     if (req.file) {
          imageUrl = `/uploads/${req.file.filename}`;
     }

     try {
          await Post.update(
               { title, content, tags, imageUrl },
               { where: { id: req.params.id, userId: req.session.user.id } }
          );
          req.flash('success_msg', 'Post updated successfully.');
          res.redirect('/users/profile');
     } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
     }
};

// Delete a post
export const deletePost = async (req, res) => {
     const { postId } = req.params; // Assuming you're passing the post ID in the URL
     try {
          const post = await Post.findByPk(postId); // Fetch the post to get the image URL
          if (post && post.imageUrl) {
               // Extract the file path from the imageUrl
               const filePath = post.imageUrl.split('/').pop(); // Get the filename from the URL
               await deleteFileFromStorage(`post_uploads/${filePath}`); // Delete the file from Firebase Storage
          }

          await Post.destroy({ where: { id: postId } }); // Delete the post from the database
          req.flash('success_msg', 'Post deleted successfully.');
          res.redirect('/users/profile');
     } catch (error) {
          console.error(error);
          req.flash('error_msg', 'internal server error: Post could not be deleted, try again');
          res.status(500).redirect('/users/profile');
     }
};
