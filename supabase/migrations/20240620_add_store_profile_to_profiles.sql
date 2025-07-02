-- Add store profile fields to profiles table
ALTER TABLE public.profiles
  ADD COLUMN store_name TEXT,
  ADD COLUMN store_description TEXT,
  ADD COLUMN store_image_url TEXT; 