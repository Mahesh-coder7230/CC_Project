require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const productsRoute = require('./routes/productsroute.js');
const authRoute = require('./routes/authRoutes.js');
const cartRoute = require('./routes/cartRoutes.js');
const orderRoute = require('./routes/orderRoutes.js');
const paymentRoute = require('./routes/paymentRoutes.js');
const dns = require('dns')
const bcrypt = require('bcrypt');
const User = require('./models/User.js');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;
const app = express();
const publicDir = path.join(__dirname,'public')
dns.setServers([
    '8.8.8.8',
    '8.8.4.4'
])
app.use(cors());
app.use(express.json());
app.use(express.static(publicDir))
app.use('/api/products', productsRoute);
app.use('/api/auth', authRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/payments', paymentRoute);
const ensureAdminUser = async () => {
    const credentialsPath = path.join(__dirname, 'admin-credentials.txt');
    const credentials = Object.fromEntries(
        fs.readFileSync(credentialsPath, 'utf8')
            .split(/\r?\n/)
            .filter((line) => line && !line.startsWith('#'))
            .map((line) => line.split('='))
            .map(([key, ...value]) => [key.trim(), value.join('=').trim()])
    );
    const email = credentials.ADMIN_EMAIL;
    const password = credentials.ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required in admin-credentials.txt');
    }

    const existingAdmin = await User.findOne({ email });

    if (!existingAdmin) {
        await User.create({
            name: 'Store Admin',
            email,
            password: await bcrypt.hash(password, 10),
            role: 'admin',
        });
        console.log(`Dummy admin created: ${email}`);
    } else if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        existingAdmin.password = await bcrypt.hash(password, 10);
        await existingAdmin.save();
    }
};

app.get("*name",(req,res)=>{
    res.sendFile(path.join(publicDir,'index.html'))

})

app.listen(PORT, async () => {
    await connectDB();
    await ensureAdminUser();
    console.log(`Server is running on port ${PORT}`);
});