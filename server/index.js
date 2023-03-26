import express from 'express';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { query } from "./services/db.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/getTableProduct', async (req, res, next) => {
    try{
        const productTable = await query(`SELECT * FROM product`);
        return res.json(productTable);
    }catch (error) {
        console.error(error);
        return res.status(403).json({"error": error});
    }
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

