import { Client } from 'pg';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

async function testDatabase() {
  console.log('Testing database connection...');

  const clientConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'daylife',
  } as const;

  const client = new Client(clientConfig);

  try {
    await client.connect();
    console.log('Database connection successful!');

    const result = await client.query(
      'SELECT NOW() as current_time, version() as version',
    );
    console.log('Database Time:', result.rows[0].current_time);
    console.log('Database Version:', result.rows[0].version);

    await client.end();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

async function testRedis() {
  console.log('Testing Redis connection...');

  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  });

  try {
    await redis.ping();
    console.log('Redis connection successful!');

    await redis.set('test_key', 'test_value');
    const value = await redis.get('test_key');
    console.log(
      'Redis Test Key Value:',
      value === 'test_value' ? 'Success' : 'Failed',
    );
    await redis.del('test_key');

    redis.disconnect();
  } catch (error) {
    console.error('Redis connection failed:', error);
    process.exit(1);
  }
}

async function main() {
  console.log('Starting connection tests...\n');

  await testDatabase();
  await testRedis();

  console.log('\nAll connections tested successfully.');
  process.exit(0);
}

void main();
