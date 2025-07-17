"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersByRole = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const User_model_1 = require("../models/User.model");
// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User_model_1.User.find({}).select('-password');
        return res.json({
            success: true,
            message: 'Users retrieved successfully',
            data: {
                users: users.map(user => user.toSafeObject())
            }
        });
    }
    catch (error) {
        console.error('Get all users error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getAllUsers = getAllUsers;
// Get user by ID (Admin or self)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if user is requesting their own profile or is admin
        if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        const user = await User_model_1.User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.json({
            success: true,
            message: 'User retrieved successfully',
            data: {
                user: user.toSafeObject()
            }
        });
    }
    catch (error) {
        console.error('Get user by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getUserById = getUserById;
// Update user (Admin or self)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if user is updating their own profile or is admin
        if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }
        const allowedUpdates = [
            'firstName', 'lastName', 'avatar', 'bio', 'dateOfBirth',
            'phone', 'address', 'preferences', 'isActive', 'role'
        ];
        // Only admins can update role and isActive
        if (req.user.role !== 'admin') {
            allowedUpdates.splice(allowedUpdates.indexOf('role'), 1);
            allowedUpdates.splice(allowedUpdates.indexOf('isActive'), 1);
        }
        const updateData = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        const user = await User_model_1.User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.json({
            success: true,
            message: 'User updated successfully',
            data: {
                user: user.toSafeObject()
            }
        });
    }
    catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateUser = updateUser;
// Delete user (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_model_1.User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        return res.json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.deleteUser = deleteUser;
// Get users by role (Admin only)
const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const users = await User_model_1.User.find({ role }).select('-password');
        return res.json({
            success: true,
            message: `Users with role '${role}' retrieved successfully`,
            data: {
                users: users.map(user => user.toSafeObject())
            }
        });
    }
    catch (error) {
        console.error('Get users by role error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getUsersByRole = getUsersByRole;
