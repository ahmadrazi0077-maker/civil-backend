// In-memory inquiries
let inquiries = [];

// @desc    Create inquiry
const createInquiry = async (req, res) => {
  const inquiry = {
    id: Date.now().toString(),
    ...req.body,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  inquiries.push(inquiry);
  res.status(201).json(inquiry);
};

// @desc    Get all inquiries
const getInquiries = async (req, res) => {
  res.json({ inquiries, total: inquiries.length });
};

// @desc    Update inquiry
const updateInquiry = async (req, res) => {
  const index = inquiries.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    inquiries[index] = { ...inquiries[index], ...req.body };
    res.json(inquiries[index]);
  } else {
    res.status(404).json({ message: 'Inquiry not found' });
  }
};

// @desc    Delete inquiry
const deleteInquiry = async (req, res) => {
  inquiries = inquiries.filter(i => i.id !== req.params.id);
  res.json({ message: 'Inquiry deleted' });
};

module.exports = {
  createInquiry,
  getInquiries,
  updateInquiry,
  deleteInquiry,
};