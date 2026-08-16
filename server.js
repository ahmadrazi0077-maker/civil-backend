const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Models
const Service = require('./models/Service');
const BlogPost = require('./models/BlogPost');
const Inquiry = require('./models/Inquiry');
const Project = require('./models/Project');

dotenv.config();

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
connectDB();

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Civil Services API is running',
    database: 'Connected',
  });
});

// ============ AUTH ROUTES ============
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Hardcoded demo login
    if (username === 'admin' && password === 'admin123') {
      return res.json({
        _id: 'admin-1',
        username: 'admin',
        email: 'admin@civilpro.com',
        role: 'admin',
        token: 'demo-token-' + Date.now(),
      });
    }
    
    res.status(401).json({ message: 'Invalid username or password' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/profile', (req, res) => {
  res.json({
    _id: 'admin-1',
    username: 'admin',
    email: 'admin@civilpro.com',
    role: 'admin',
  });
});

// ============ SERVICE ROUTES ============
// ============ SERVICE ROUTES ============

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort('order');
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.json([]);
  }
});

// Get all services (admin - includes inactive)
app.get('/api/services/all', async (req, res) => {
  try {
    console.log('Fetching all services for admin');
    const services = await Service.find().sort('order');
    console.log('Found services:', services.length);
    res.json({ services, total: services.length });
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.json({ services: [], total: 0 });
  }
});

// Get single service by slug
app.get('/api/services/slug/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    res.status(500).json({ message: 'Error fetching service' });
  }
});

// Get single service by ID (admin)
app.get('/api/services/id/:id', async (req, res) => {
  try {
    console.log('Fetching service by ID:', req.params.id);
    
    const service = await Service.findById(req.params.id);
    
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    res.status(500).json({ message: 'Error fetching service' });
  }
});

// Create service
app.post('/api/services', async (req, res) => {
  try {
    console.log('Creating service:', req.body);
    
    const { title, slug, icon, shortDescription, description, features, price, timeline, image, imagePublicId, order } = req.body;
    
    if (!title || !slug || !shortDescription || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['title', 'slug', 'shortDescription', 'description'],
      });
    }
    
    const existingService = await Service.findOne({ slug });
    if (existingService) {
      return res.status(400).json({ message: 'Service with this slug already exists' });
    }
    
    const service = await Service.create({
      title,
      slug,
      icon: icon || '🛠️',
      shortDescription,
      description,
      features: features || [],
      price: price || '',
      timeline: timeline || '',
      image: image || '',
      imagePublicId: imagePublicId || '',
      order: order || 0,
    });
    
    console.log('✅ Service created:', service.title);
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: error.message || 'Error creating service' });
  }
});

// Update service by ID
app.put('/api/services/:id', async (req, res) => {
  try {
    console.log('Updating service:', req.params.id);
    console.log('Update data:', req.body);
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      console.log('Service not found');
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Update all fields
    service.title = req.body.title || service.title;
    service.slug = req.body.slug || service.slug;
    service.icon = req.body.icon || service.icon;
    service.shortDescription = req.body.shortDescription || service.shortDescription;
    service.description = req.body.description || service.description;
    service.features = req.body.features || service.features;
    service.price = req.body.price || service.price;
    service.timeline = req.body.timeline || service.timeline;
    service.order = req.body.order || service.order;
    
    if (req.body.image) {
      service.image = req.body.image;
      service.imagePublicId = req.body.imagePublicId || service.imagePublicId;
    }
    
    if (req.body.isActive !== undefined) {
      service.isActive = req.body.isActive;
    }
    
    const updatedService = await service.save();
    console.log('✅ Service updated:', updatedService.title);
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: error.message || 'Error updating service' });
  }
});

// Delete service
app.delete('/api/services/:id', async (req, res) => {
  try {
    console.log('Deleting service:', req.params.id);
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    await service.deleteOne();
    console.log('✅ Service deleted:', service.title);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service' });
  }
});

// ============ BLOG ROUTES ============
// Get all blog posts
// ============ BLOG ROUTES ============

// Get all blog posts
// ============ BLOG ROUTES ============

// Get all blog posts
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await BlogPost.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ posts, total: posts.length });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Fallback data
    res.json({ posts: [], total: 0 });
  }
});

// Get all blog posts (including unpublished for admin)
app.get('/api/blog/all', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ posts, total: posts.length });
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    res.json({ posts: [], total: 0 });
  }
});

// Get single blog post
app.get('/api/blog/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    });
    
    if (post) {
      // Increment views
      post.views += 1;
      await post.save();
      res.json(post);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Error fetching blog post' });
  }
});

// Create blog post
app.post('/api/blog', async (req, res) => {
  try {
    console.log('Creating blog post:', req.body);
    
    const { title, slug, excerpt, content, category, author, readTime, tags, image, imagePublicId } = req.body;
    
    // Validate required fields
    if (!title || !slug || !excerpt || !content || !category || !author) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['title', 'slug', 'excerpt', 'content', 'category', 'author'],
      });
    }
    
    // Check if slug exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ message: 'Blog post with this slug already exists' });
    }
    
    const post = await BlogPost.create({
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      readTime: readTime || '5 min read',
      tags: tags || [],
      image: image || '',
      imagePublicId: imagePublicId || '',
      isPublished: true,
    });
    
    console.log('✅ Blog post created:', post.title);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: error.message || 'Error creating blog post' });
  }
});

// Update blog post
app.put('/api/blog/:id', async (req, res) => {
  try {
    console.log('Updating blog post:', req.params.id);
    
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Update fields
    post.title = req.body.title || post.title;
    post.slug = req.body.slug || post.slug;
    post.excerpt = req.body.excerpt || post.excerpt;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;
    post.author = req.body.author || post.author;
    post.readTime = req.body.readTime || post.readTime;
    post.tags = req.body.tags || post.tags;
    post.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : post.isPublished;
    
    if (req.body.image) {
      post.image = req.body.image;
      post.imagePublicId = req.body.imagePublicId || post.imagePublicId;
    }
    
    const updatedPost = await post.save();
    console.log('✅ Blog post updated:', updatedPost.title);
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: error.message || 'Error updating blog post' });
  }
});

// Delete blog post
app.delete('/api/blog/:id', async (req, res) => {
  try {
    console.log('Deleting blog post:', req.params.id);
    
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    await post.deleteOne();
    console.log('✅ Blog post deleted:', post.title);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: error.message || 'Error deleting blog post' });
  }
});

// ============ INQUIRY ROUTES ============
// Create inquiry
// ============ INQUIRY ROUTES ============

// IMPORTANT: Stats route pehle rakho (specific routes pehle)
// Get inquiry statistics (Admin)
app.get('/api/inquiries/stats', async (req, res) => {
  try {
    console.log('Fetching inquiry stats');
    
    const total = await Inquiry.countDocuments();
    const newInquiries = await Inquiry.countDocuments({ status: 'new' });
    const readInquiries = await Inquiry.countDocuments({ status: 'read' });
    const repliedInquiries = await Inquiry.countDocuments({ status: 'replied' });
    const archivedInquiries = await Inquiry.countDocuments({ status: 'archived' });
    
    console.log('Stats:', { total, new: newInquiries, read: readInquiries, replied: repliedInquiries });
    
    res.json({
      total,
      new: newInquiries,
      read: readInquiries,
      replied: repliedInquiries,
      archived: archivedInquiries,
    });
  } catch (error) {
    console.error('Error fetching inquiry stats:', error);
    res.json({ total: 0, new: 0, read: 0, replied: 0, archived: 0 });
  }
});

// Get all inquiries (Admin)
app.get('/api/inquiries', async (req, res) => {
  try {
    console.log('Fetching all inquiries');
    
    const { status } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
    
    console.log(`Found ${inquiries.length} inquiries`);
    
    res.json({ inquiries, total: inquiries.length });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.json({ inquiries: [], total: 0 });
  }
});

// Create inquiry (Public)
app.post('/api/inquiries', async (req, res) => {
  try {
    console.log('Creating inquiry:', req.body);
    
    const { name, email, phone, service, message } = req.body;
    
    if (!name || !email || !service || !message) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['name', 'email', 'service', 'message'],
      });
    }
    
    const inquiry = await Inquiry.create({
      name,
      email,
      phone: phone || '',
      service,
      message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status: 'new',
    });
    
    console.log('✅ Inquiry created:', inquiry.name);
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      inquiry,
    });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ message: 'Error submitting inquiry' });
  }
});

// Get single inquiry by ID (Admin)
app.get('/api/inquiries/:id', async (req, res) => {
  try {
    // Skip if id is 'stats'
    if (req.params.id === 'stats') {
      return next();
    }
    
    console.log('Fetching inquiry:', req.params.id);
    
    const inquiry = await Inquiry.findById(req.params.id);
    
    if (inquiry) {
      res.json(inquiry);
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({ message: 'Error fetching inquiry' });
  }
});

// Update inquiry (Admin)
app.put('/api/inquiries/:id', async (req, res) => {
  try {
    console.log('Updating inquiry:', req.params.id, req.body);
    
    const inquiry = await Inquiry.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    if (req.body.status) {
      inquiry.status = req.body.status;
      if (req.body.status === 'replied') {
        inquiry.repliedAt = new Date();
      }
    }
    
    if (req.body.reply) {
      inquiry.reply = req.body.reply;
    }
    
    const updatedInquiry = await inquiry.save();
    console.log('✅ Inquiry updated:', updatedInquiry.name);
    res.json(updatedInquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    res.status(500).json({ message: 'Error updating inquiry' });
  }
});

// Mark inquiry as read (Admin)
app.patch('/api/inquiries/:id/read', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    inquiry.status = 'read';
    inquiry.readAt = new Date();
    
    const updatedInquiry = await inquiry.save();
    res.json(updatedInquiry);
  } catch (error) {
    console.error('Error marking inquiry as read:', error);
    res.status(500).json({ message: 'Error updating inquiry' });
  }
});

// Delete inquiry (Admin)
app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    console.log('Deleting inquiry:', req.params.id);
    
    const inquiry = await Inquiry.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    
    await inquiry.deleteOne();
    console.log('✅ Inquiry deleted:', inquiry.name);
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ message: 'Error deleting inquiry' });
  }
});


// ============ PROJECT ROUTES ============

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = { isActive: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Get single project
app.get('/api/projects/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });
    
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Create project
app.post('/api/projects', async (req, res) => {
  try {
    console.log('Creating project:', req.body);
    
    const { 
      title, slug, category, location, size, duration, value, 
      description, image, imagePublicId, clientName, year, isFeatured 
    } = req.body;
    
    if (!title || !slug || !category || !location || !size || !duration || !value || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['title', 'slug', 'category', 'location', 'size', 'duration', 'value', 'description'],
      });
    }
    
    const existingProject = await Project.findOne({ slug });
    if (existingProject) {
      return res.status(400).json({ message: 'Project with this slug already exists' });
    }
    
    const project = await Project.create({
      title,
      slug,
      category,
      location,
      size,
      duration,
      value,
      description,
      image: image || '',
      imagePublicId: imagePublicId || '',
      clientName: clientName || '',
      year: year || new Date().getFullYear(),
      isFeatured: isFeatured || false,
    });
    
    console.log('✅ Project created:', project.title);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: error.message || 'Error creating project' });
  }
});

// Update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    Object.assign(project, req.body);
    
    const updatedProject = await project.save();
    console.log('✅ Project updated:', updatedProject.title);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: error.message || 'Error updating project' });
  }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await project.deleteOne();
    console.log('✅ Project deleted:', project.title);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});

// Import Subscriber model (top par)
const Subscriber = require('./models/Subscriber');

// ============ NEWSLETTER ROUTES ============

// Subscribe to newsletter (Public)
app.post('/api/subscribers', async (req, res) => {
  try {
    console.log('New subscription:', req.body);
    
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return res.status(400).json({ message: 'Email already subscribed' });
      } else {
        // Re-activate subscription
        existingSubscriber.status = 'active';
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.unsubscribedAt = null;
        await existingSubscriber.save();
        return res.status(200).json({
          success: true,
          message: 'Subscription reactivated successfully',
          subscriber: existingSubscriber,
        });
      }
    }
    
    const subscriber = await Subscriber.create({
      email,
      name: name || '',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    console.log('✅ New subscriber:', subscriber.email);
    res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
      subscriber,
    });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ message: 'Error subscribing to newsletter' });
  }
});

// Get all subscribers (Admin)
app.get('/api/subscribers', async (req, res) => {
  try {
    console.log('Fetching subscribers');
    
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const subscribers = await Subscriber.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await Subscriber.countDocuments(query);
    const activeCount = await Subscriber.countDocuments({ status: 'active' });
    const unsubscribedCount = await Subscriber.countDocuments({ status: 'unsubscribed' });
    
    console.log(`Found ${subscribers.length} subscribers`);
    
    res.json({
      subscribers,
      total,
      activeCount,
      unsubscribedCount,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.json({ subscribers: [], total: 0, activeCount: 0, unsubscribedCount: 0 });
  }
});

// Unsubscribe from newsletter (Public)
app.delete('/api/subscribers/:email', async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    
    const subscriber = await Subscriber.findOne({ email });
    
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    
    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();
    
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ message: 'Error unsubscribing' });
  }
});

// Delete subscriber (Admin)
app.delete('/api/subscribers/:id', async (req, res) => {
  try {
    console.log('Deleting subscriber:', req.params.id);
    
    const subscriber = await Subscriber.findById(req.params.id);
    
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    
    await subscriber.deleteOne();
    console.log('✅ Subscriber deleted:', subscriber.email);
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ message: 'Error deleting subscriber' });
  }
});

// Get subscriber stats (Admin)
app.get('/api/subscribers/stats', async (req, res) => {
  try {
    const total = await Subscriber.countDocuments();
    const active = await Subscriber.countDocuments({ status: 'active' });
    const unsubscribed = await Subscriber.countDocuments({ status: 'unsubscribed' });
    const today = await Subscriber.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    res.json({ total, active, unsubscribed, today });
  } catch (error) {
    console.error('Error fetching subscriber stats:', error);
    res.json({ total: 0, active: 0, unsubscribed: 0, today: 0 });
  }
});

// Toggle featured status
app.patch('/api/projects/:id/featured', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    project.isFeatured = !project.isFeatured;
    await project.save();
    
    res.json(project);
  } catch (error) {
    console.error('Error toggling featured:', error);
    res.status(500).json({ message: 'Error toggling featured status' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ API: http://localhost:${PORT}`);
});