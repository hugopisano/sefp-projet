import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'

import { adminRouter } from './Routes/AdminRoute.js'
import Jwt from 'jsonwebtoken'

const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())
app.use('/auth', adminRouter)

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
            if (err) return res.json({ Status: false, Error: "Wrong Token" })
            req.id = decoded.id;
            req.role = decoded.role;
            next()
        })
    } else {
        return req.json({ Status: false, Error: "Not authenticated" })
    }
}
app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id })
})

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`)
})