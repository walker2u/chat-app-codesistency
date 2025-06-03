import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';

const app = express.Router();

app.post('/login', login);

app.post('/signup', signup);

app.post('/logout', logout);

export default app;