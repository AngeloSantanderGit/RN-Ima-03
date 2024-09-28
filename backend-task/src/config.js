//import mysql from 'mysql2/promise';
import {config as dotenv} from 'dotenv'
dotenv()

export const config = {
    
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        
    }
    
    //apiKey: process.env.API_URL,
    //organization: process.env.OPENAI_ORGANIZATION_ID

export const config2 = {
    
    apiKey: process.env.API_URL,
}