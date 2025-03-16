
import { useMemo } from "react"
import { CartItem } from "@/types"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils"

interface OrderSummaryProps {
  cartItems: CartItem[]
  className?: string
}

export function OrderSummary({ cartItems, className }: OrderSummaryProps) {
  const subtotal = useMemo(() => 
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  )
  
  const tax = useMemo(() => subtotal * 0.1, [subtotal]) // 10% tax
  const shipping = 5.99
  const total = subtotal + tax + shipping

  return (
    <div className={className}>
      <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-medium text-base pt-2">
          <span>Total</span>
          <span className="text-cafePurple">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
