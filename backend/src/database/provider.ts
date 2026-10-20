import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema.js';

export const DRIZZLE = 'DRIZZLE';

export const databaseProviders = [
  {
    provide: DRIZZLE,
    useFactory: () => {
      const sql = neon(process.env.DATABASE_URL!);
      return drizzle({ client: sql, schema });
    },
  },
];
