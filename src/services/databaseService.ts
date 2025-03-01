import { getConnection } from 'typeorm';

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const connection = getConnection();
    await connection.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
};
