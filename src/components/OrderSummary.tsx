
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CartItem } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  showItems?: boolean;
}

const OrderSummary = ({ items, totalPrice, showItems = true }: OrderSummaryProps) => {
  // Calculate subtotal, shipping cost and total
  const subtotal = totalPrice;
  const shippingCost = 0; // Free shipping for now
  const total = subtotal + shippingCost;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showItems && items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-md overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(item.price * item.quantity, item.currency)}
                </div>
              </div>
            ))}
          </div>
        )}

        <Separator />

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <p className="text-sm">Subtotal</p>
            <p className="text-sm font-medium">{formatCurrency(subtotal)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm">Shipping</p>
            <p className="text-sm font-medium">{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</p>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between">
          <p className="font-medium">Total</p>
          <p className="font-bold">{formatCurrency(total)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
