// Configuration file for environment variables and settings
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  WARNING: Supabase not fully configured (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing). API features will be unavailable.');
}

console.log('✓ Configuration loaded');
