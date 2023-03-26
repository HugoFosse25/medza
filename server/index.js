import express from 'express';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import bcrypt from 'bcryptjs'
import moment from 'moment'
import { query } from "./services/db.js";

const app = express();
app.use(express.json());
app.use(cors());

const salt = bcrypt.genSaltSync(25);

app.get('/api/getTableProduct', async (req, res, next) => {
    try{
        const productTable = await query(`SELECT * FROM product`);
        return res.json(productTable);
    }catch (error) {
        console.error(error);
        return res.status(403).json({"error": error});
    }
})

app.post('/api/newRegistration', async (req, res, next) => {
    try{
        let buyerWithSameEmail = await query(`SELECT * FROM buyer WHERE email = "${req.body.email}" OR name ="${req.body.name}"`);
        if(buyerWithSameEmail == 0) {
            
            const hash = bcrypt.hashSync(req.body.passwd, salt);
            const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            await query(`INSERT INTO buyer (name, email, created_at, passwd_hash) VALUES (${req.body.name}, ${req.body.email}, ${currentDateTime}, ${hash})`);
        }    
    }catch (error) {
        console.log(error);
        return res.status(403).json({"error": error});
    }

    return res.status(200).send();
})

try {

    const server = http.createServer(app);
    console.log(`Demarrage du serveur HTTP`);
    const wss = new WebSocketServer({ server});
    console.log(`Demarrage du serveur WebSocket`);
    server.listen(3000, () => {
        console.log('API Medza démarrée http://localhost:3000.');
    })

}catch (error) {
    console.log(error);
}

