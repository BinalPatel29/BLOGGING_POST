import express from 'express';
import Blog from '../model/Blog.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { text, content, category, tags } = req.body;
    const blog = new Blog({ text, content, category, tags });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { text, content, category, tags } = req.body;
    const blog = await Blog.findOneAndReplace(
      { _id: req.params.id },
      { text, content, category, tags },
      { new: true, runValidators: true, overwrite: true }
    );
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    next(error);
  }
});

export default router;