const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all items with optional filtering
router.get('/', async (req, res) => {
  try {
    const { search, category, sellerId } = req.query;
    
    const where = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.category = category;
    }
    
    if (sellerId) {
      where.sellerId = parseInt(sellerId);
    }
    
    const items = await prisma.item.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        photos: true,
        _count: {
          select: { favorites: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json({ items });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        photos: true,
        _count: {
          select: { favorites: true },
        },
      },
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ item });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Create item
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    
    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const item = await prisma.item.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        sellerId: req.userId,
      },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        photos: true,
      },
    });
    
    res.status(201).json({ item });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update item
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const { title, description, price, category } = req.body;
    
    const existingItem = await prisma.item.findUnique({
      where: { id: itemId },
    });
    
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (existingItem.sellerId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this item' });
    }
    
    const item = await prisma.item.update({
      where: { id: itemId },
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
      },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        photos: true,
      },
    });
    
    res.json({ item });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete item
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    
    const existingItem = await prisma.item.findUnique({
      where: { id: itemId },
    });
    
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (existingItem.sellerId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }
    
    await prisma.item.delete({
      where: { id: itemId },
    });
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Add photo to item
router.post('/:id/photos', authMiddleware, async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'Photo URL is required' });
    }
    
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (item.sellerId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to add photos to this item' });
    }
    
    const photo = await prisma.photo.create({
      data: {
        url,
        itemId,
      },
    });
    
    res.status(201).json({ photo });
  } catch (error) {
    console.error('Add photo error:', error);
    res.status(500).json({ error: 'Failed to add photo' });
  }
});

// Favorite an item
router.post('/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_itemId: {
          userId: req.userId,
          itemId,
        },
      },
    });
    
    if (existingFavorite) {
      return res.status(400).json({ error: 'Item already favorited' });
    }
    
    const favorite = await prisma.favorite.create({
      data: {
        userId: req.userId,
        itemId,
      },
    });
    
    res.status(201).json({ favorite });
  } catch (error) {
    console.error('Favorite item error:', error);
    res.status(500).json({ error: 'Failed to favorite item' });
  }
});

// Unfavorite an item
router.delete('/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_itemId: {
          userId: req.userId,
          itemId,
        },
      },
    });
    
    if (!existingFavorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    await prisma.favorite.delete({
      where: {
        userId_itemId: {
          userId: req.userId,
          itemId,
        },
      },
    });
    
    res.json({ message: 'Item unfavorited successfully' });
  } catch (error) {
    console.error('Unfavorite item error:', error);
    res.status(500).json({ error: 'Failed to unfavorite item' });
  }
});

// Get current user's listings
router.get('/me/listings', authMiddleware, async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { sellerId: req.userId },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        photos: true,
        _count: {
          select: { favorites: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json({ items });
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({ error: 'Failed to fetch user listings' });
  }
});

// Get current user's favorites
router.get('/me/favorites', authMiddleware, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId },
      include: {
        item: {
          include: {
            seller: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
            photos: true,
            _count: {
              select: { favorites: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    const items = favorites.map(fav => fav.item);
    
    res.json({ items });
  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch user favorites' });
  }
});

module.exports = router;

