const express = require('express');
const router = express.Router();
const Shipping = require('../models/Shipping');

// Save Shipping Details
router.post('/save-shipping', async (req, res) => {
    const {
        userId,
        fullName,
        email,
        phone,
        address,
        landMark,
        city,
        state,
        zipCode
    } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    try {
        const shippingDetails = new Shipping({
            userId,
            fullName,
            email,
            phone,
            address,
            landMark,
            city,
            state,
            zipCode
        });

        await shippingDetails.save();
        res.status(201).json({ message: 'Shipping details saved successfully', shippingDetails });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/get-shipping', async (req, res) => {
    try {
        const shippingDetails = await Shipping.find().sort({ createdAt: -1 }); // Sort by latest orders
        res.status(200).json(shippingDetails);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Get Shipping Details by User ID
router.get('/get-shipping/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const shippingDetails = await Shipping.findOne({ userId });
        if (!shippingDetails) return res.status(404).json({ message: "No shipping details found" });

        res.status(200).json(shippingDetails);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
