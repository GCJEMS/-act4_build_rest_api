import express, { Request, Response } from 'express';
import { Product , UnitProduct } from './product.interface';
import * as database from './product.database';
import { StatusCodes } from 'http-status-codes';

export const productRouter = express.Router();

productRouter.get('/products', async (req: Request, res: Response) => {
try {
const allProducts = await database.findAll();

if (!allProducts) {
 res.status(StatusCodes.NOT_FOUND).json({error: 'No products found' });
}

 res.status(StatusCodes.OK).json({total :allProducts.length, allProducts});
} catch (error) {
res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
}
})

productRouter.get("/product/:id", async (req: Request, res: Response) => {
try{
const product = await database.findOne(req.params.id);

if (!product) {
res.status(StatusCodes.NOT_FOUND).json({error: 'Product does not exist' });
}

res.status(StatusCodes.OK).json({product});
}catch(error){
res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
}
})

productRouter.post("/product", async (req: Request, res: Response) => {
try{
const { name, price, quantity, image} = req.body;

if (!name || !price || !quantity || !image) {
 res.status(StatusCodes.BAD_REQUEST).json({error: 'Please fill all fields' });
}
const newProduct = await database.create({ ...req.body });
 res.status(StatusCodes.CREATED).json({newProduct});
}catch(error){
 res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
}
})

productRouter.put("/product/:id", async (req: Request, res: Response) => {
try{
const id = req.params.id;
const newProduct = req.body;
const findProduct = await database.findOne(id);

if (!findProduct) {
 res.status(StatusCodes.NOT_FOUND).json({error: 'Product does not exist' });
}

const updatedProduct = await database.update(id, newProduct);
 res.status(StatusCodes.OK).json({updatedProduct});
} catch(error){
 res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
}
})

productRouter.delete("/product/:id", async (req: Request, res: Response) => {
try{
const getProduct = await database.findOne(req.params.id);

if (!getProduct) {
 res.status(StatusCodes.NOT_FOUND).json({error: `No product with ID ${req.params.id}` });
}

await database.remove(req.params.id);

 res.status(StatusCodes.OK).json({message: `Product with ID ${req.params.id} deleted`});
} catch(error){
 res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
}
})