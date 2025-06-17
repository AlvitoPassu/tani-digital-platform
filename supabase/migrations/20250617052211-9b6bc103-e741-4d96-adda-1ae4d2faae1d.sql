
-- Create cart table to store user's cart items
CREATE TABLE public.cart (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- Create policies for cart access
CREATE POLICY "Users can view their own cart items" 
  ON public.cart 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" 
  ON public.cart 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
  ON public.cart 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
  ON public.cart 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create unique constraint to prevent duplicate products in cart
CREATE UNIQUE INDEX cart_user_product_unique ON public.cart (user_id, product_id);

-- Create function to update cart item quantity or insert new item
CREATE OR REPLACE FUNCTION public.upsert_cart_item(
  p_user_id UUID,
  p_product_id BIGINT,
  p_quantity INTEGER
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.cart (user_id, product_id, quantity)
  VALUES (p_user_id, p_product_id, p_quantity)
  ON CONFLICT (user_id, product_id)
  DO UPDATE SET 
    quantity = cart.quantity + p_quantity,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
