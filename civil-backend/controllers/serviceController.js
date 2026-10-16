// In-memory data
let services = [
  {
    id: '1',
    title: 'Steel Detailing',
    slug: 'steel-detailing',
    icon: '🏗️',
    shortDescription: 'Precise steel detailing services',
    description: 'Complete steel detailing services for construction projects.',
    features: ['Shop drawings', 'Connection design', 'Material lists'],
    price: 'Starting from $500',
    timeline: '3-5 business days',
  },
  {
    id: '2',
    title: 'Rebar Detailing',
    slug: 'rebar-detailing',
    icon: '🔩',
    shortDescription: 'Detailed reinforcement bar schedules',
    description: 'Complete rebar detailing services.',
    features: ['Bar bending schedules', 'Placement drawings'],
    price: 'Starting from $400',
    timeline: '2-4 business days',
  },
];

// @desc    Get all services
const getServices = async (req, res) => {
  res.json(services);
};

// @desc    Get single service
const getServiceBySlug = async (req, res) => {
  const service = services.find(s => s.slug === req.params.slug);
  if (service) {
    res.json(service);
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
};

// @desc    Create service
const createService = async (req, res) => {
  const newService = {
    id: Date.now().toString(),
    ...req.body,
  };
  services.push(newService);
  res.status(201).json(newService);
};

// @desc    Update service
const updateService = async (req, res) => {
  const index = services.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    services[index] = { ...services[index], ...req.body };
    res.json(services[index]);
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
};

// @desc    Delete service
const deleteService = async (req, res) => {
  services = services.filter(s => s.id !== req.params.id);
  res.json({ message: 'Service deleted' });
};

module.exports = {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
};