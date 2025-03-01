export interface Item {
    id: string;
    name: string;
    description?: string;
}

export interface Config {
    port: number;
    dbConnectionString: string;
}

export type Response<T> = {
    success: boolean;
    data?: T;
    error?: string;
};