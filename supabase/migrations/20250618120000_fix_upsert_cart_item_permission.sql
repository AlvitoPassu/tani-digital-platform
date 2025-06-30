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
$$ LANGUAGE plpgsql SECURITY INVOKER; 