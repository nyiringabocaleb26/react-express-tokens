const express = require('express');
const jwt = require('jsonwebtoken');
const bcrpt = require('bcryptjs');
const dotenv = require('dotenv');
const pool = require('./db');
const cors = require('cors');


dotenv.config();

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(cors())

app.post('/register',async(req,res) =>{
    console.log('Incoming request body',req.body);
    const id = req.params;
    const {username,password} = req.body;

    if (!username || typeof username!=='string') {
        return res.status(400).json({message:'Invalid or missing username'})
    }
    else if (!password || typeof password !=='string' || password.length < 6) {
        return res.status(400).json({message:'Password must have six'})
    }

    try {
        const hashedPassword = await bcrpt.hash(password,10);
        const [result] = await pool.query(
            `INSERT INTO tokens (username,password) VALUES(?,?)`,[username,hashedPassword]
        );
        res.status(201).json({message:'User registered successfully',userId:result.insertId});
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({message:'Username already exists'})
        }
        else{
            res.status(500).json({ message:'An error occured during registration',error:error.message })
        }
    }
});
app.post('/login', async(req,res)=>{
    const {username,password} = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM tokens WHERE username=?',[username])
        if (rows.length === 0) {
            return res.status(401).json({ message:'Invalid username or password credentials' });
        }
        const user = rows[0];
        const isMatch = await bcrpt.compare(password,user.password);

        if (!isMatch) {
            res.status(401).json({message:'invalid username or password'})
        }

        const token = jwt.sign({id:user.id,username:user.username},process.env.JWT_SECRET);
        console.log(process.env.JWT_SECRET)
        res.json({ token });
        // res.status(200).json({message:'logged in successful'})
    } catch (error) {
        res.status(500).json({message:'Database error',error})
    }
  
});

app.get('/profile',(req,res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({message:"Token missing"});
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        res.json({message:`Hello ${decoded.username}`});
    } catch (err) {
        res.status(403).json({message:'Invalid token',err});
    }
});

app.listen(PORT,() => console.log(`server running on http://localhost:${PORT}`));