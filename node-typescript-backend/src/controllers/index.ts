import { Request, Response } from 'express';

class ItemController {
    public async getAllItems(req: Request, res: Response): Promise<void> {
        // Logic to retrieve all items
        res.send('Retrieve all items');
    }

    public async createItem(req: Request, res: Response): Promise<void> {
        // Logic to create a new item
        res.send('Create a new item');
    }
}

export const itemController = new ItemController();