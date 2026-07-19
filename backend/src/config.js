// Configuration file for environment variables and settings
import dotenv from 'dotenv';

dotenv.config();


if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  WARNING: Supabase not fully configured (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing). API features will be unavailable.');
}

const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY
);
export const config = {
  PORT: process.env.PORT || 3000,
  SUPABASE: supabase,
  NODE_ENV: process.env.NODE_ENV || 'development',
};


console.log('✓ Configuration loaded');
