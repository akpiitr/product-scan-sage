// This file exports data models that define the structure of the data used in the application.

export interface Item {
    id: number;
    name: string;
    description: string;
}

export class ItemModel {
    private items: Item[] = [];

    public getAllItems(): Item[] {
        return this.items;
    }

    public createItem(item: Item): void {
        this.items.push(item);
    }
}