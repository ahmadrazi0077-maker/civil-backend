// In-memory blog posts
let blogPosts = [
  {
    id: '1',
    slug: 'importance-of-steel-detailing',
    title: 'The Importance of Accurate Steel Detailing',
    excerpt: 'Learn why precise steel detailing is crucial.',
    content: 'Full content here...',
    category: 'Steel Detailing',
    author: 'John Engineer',
    date: '2024-01-15',
    readTime: '5 min read',
  },
];

// @desc    Get all blog posts
const getBlogPosts = async (req, res) => {
  res.json({ posts: blogPosts, total: blogPosts.length });
};

// @desc    Get single blog post
const getBlogPostBySlug = async (req, res) => {
  const post = blogPosts.find(p => p.slug === req.params.slug);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Blog post not found' });
  }
};

// @desc    Create blog post
const createBlogPost = async (req, res) => {
  const newPost = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    ...req.body,
  };
  blogPosts.push(newPost);
  res.status(201).json(newPost);
};

// @desc    Update blog post
const updateBlogPost = async (req, res) => {
  const index = blogPosts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    blogPosts[index] = { ...blogPosts[index], ...req.body };
    res.json(blogPosts[index]);
  } else {
    res.status(404).json({ message: 'Blog post not found' });
  }
};

// @desc    Delete blog post
const deleteBlogPost = async (req, res) => {
  blogPosts = blogPosts.filter(p => p.id !== req.params.id);
  res.json({ message: 'Blog post deleted' });
};

module.exports = {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};