import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { JWT_SECRET, AuthenticatedRequest } from '../middleware/auth.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role = 'user' } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({ success: false, message: 'All fields (Name, Email, Phone, Password) are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    // Check if user exists
    const existing = await db.getUserByEmail(email);
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const validRole = ['user', 'admin', 'technician'].includes(role) ? role : 'user';

    const newUser = await db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: hashedPassword,
      role: validRole as 'user' | 'admin' | 'technician',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    });

    // If registered as technician, also create technician profile
    if (validRole === 'technician') {
      await db.createTechnician({
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        specialization: 'General Maintenance',
        experienceYears: 3,
        rating: 5.0,
        totalResolved: 0,
        activeJobs: 0,
        isAvailable: true,
        avatar: newUser.avatar
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userObj = { ...newUser };
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to FixMate.',
      token,
      user: userObj
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error during registration: ' + error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    const user = await db.getUserByEmail(email);
    if (!user || !user.password) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userObj = { ...user };
    delete userObj.password;

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: userObj
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error during login: ' + error.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }
    const userObj = { ...req.user };
    delete userObj.password;
    res.json({ success: true, user: userObj });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { name, phone, avatar } = req.body;
    const updates: any = {};
    if (name) updates.name = name.trim();
    if (phone) updates.phone = phone.trim();
    if (avatar) updates.avatar = avatar;

    const updatedUser = await db.updateUser(req.user._id, updates);
    if (!updatedUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const userObj = { ...updatedUser };
    delete userObj.password;

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: userObj
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Current and new passwords are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
      return;
    }

    const user = await db.getUserById(req.user._id);
    if (!user || !user.password) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password does not match.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.updateUser(user._id, { password: hashedPassword });

    res.json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
