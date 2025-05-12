const Service = require('../models/Service');

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const { name, description, category, pricing, estimatedDuration, icon } = req.body;

    const service = await Service.create({
      name,
      description,
      category,
      pricing,
      estimatedDuration,
      icon,
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const services = await Service.find(filter);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const { name, description, category, pricing, estimatedDuration, icon } = req.body;
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Update fields
    service.name = name || service.name;
    service.description = description || service.description;
    service.category = category || service.category;
    service.pricing = pricing || service.pricing;
    service.estimatedDuration = estimatedDuration || service.estimatedDuration;
    service.icon = icon || service.icon;
    
    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    await service.remove();
    res.json({ message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};