/*
  # Add Automatic Admin Creation Trigger

  1. Changes
    - Create a trigger function that automatically adds new users to the admins table
    - Create a trigger on auth.users that fires after insert
    - This ensures all registered users are automatically granted admin access
    
  2. Security
    - All authenticated users become admins (suitable for single-admin portfolios)
    - If you need selective admin access, remove this trigger and manually add admins
*/

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into admins table
  INSERT INTO public.admins (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'admin')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
