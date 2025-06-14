import express from 'express';
import { login, logout, signup, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const app = express.Router();

app.post('/login', login);

app.post('/signup', signup);

app.post('/logout', logout);

app.put('/updateProfile', protectedRoute, updateProfile);

app.post('/check', protectedRoute, checkAuth);

export default app;