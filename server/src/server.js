import express from 'express';
import { getPost } from './controller/createPost.js';
import { deletePost } from './controller/deletePost.js';
import { getPosts } from './controller/getPosts.js';
import { getUploadUrl } from './controller/getUploadUrl.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/get-upload-url', getUploadUrl);

app.post('/api/create-post', getPost);

app.get('/api/get-posts', getPosts);

app.delete('/api/delete-post/:id', deletePost);

// start server
app.listen(4000, () => {
  console.log('Server live on 4000');
});
