
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Truck, ArrowRight, CheckCircle2 } from "lucide-react";
import ShippingForm from "@/components/ShippingForm";
import OrderSummary from "@/components/OrderSummary";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

enum CheckoutStep {
  SELECT_METHOD,
  SHIPPING_INFO,
  PAYMENT,
  CONFIRMATION
}

enum PaymentMethod {
  ON_DELIVERY,
  STRIPE
}

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>(CheckoutStep.SELECT_METHOD);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [shippingInfo, setShippingInfo] = useState<any>(null);
  const navigate = useNavigate();

  // Helper function to handle payment method selection
  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === PaymentMethod.ON_DELIVERY) {
      setStep(CheckoutStep.SHIPPING_INFO);
    } else {
      // Simulate Stripe checkout process
      toast.info("Redirecting to Stripe...", {
        duration: 2000,
      });
      
      // For demo purposes, we'll just show a success message after a delay
      setTimeout(() => {
        setStep(CheckoutStep.CONFIRMATION);
        clearCart();
      }, 2000);
    }
  };

  // Helper function to handle form submission for shipping info
  const handleShippingInfoSubmit = (values: any) => {
    setShippingInfo(values);
    toast.success("Delivery information saved!", {
      duration: 2000,
    });
    setStep(CheckoutStep.CONFIRMATION);
    clearCart();
  };

  // If cart is empty, redirect to products page
  if (cartItems.length === 0 && step !== CheckoutStep.CONFIRMATION) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some items to your cart before proceeding to checkout.</p>
          <Button onClick={() => navigate("/products")}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-fade-in">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3">Checkout</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {step === CheckoutStep.SELECT_METHOD && "Choose your preferred payment method to continue."}
          {step === CheckoutStep.SHIPPING_INFO && "Please provide your delivery information."}
          {step === CheckoutStep.CONFIRMATION && "Thank you for your order!"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          {step === CheckoutStep.SELECT_METHOD && (
            <div className="grid gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Pay on Delivery
                  </CardTitle>
                  <CardDescription>
                    Pay with cash when your order is delivered to your doorstep
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Our delivery personnel will collect payment when they deliver your order.
                    You can inspect your items before paying.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSelectPaymentMethod(PaymentMethod.ON_DELIVERY)} className="w-full">
                    <span>Continue</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Pay with Stripe
                  </CardTitle>
                  <CardDescription>
                    Secure, fast payments with credit or debit card
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    You'll be redirected to Stripe's secure payment page to complete your purchase.
                    All major credit and debit cards accepted.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => handleSelectPaymentMethod(PaymentMethod.STRIPE)} className="w-full">
                    <span>Continue</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {step === CheckoutStep.SHIPPING_INFO && (
            <ShippingForm onSubmit={handleShippingInfoSubmit} />
          )}

          {step === CheckoutStep.CONFIRMATION && (
            <Card className="animate-scale-in">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <CardTitle className="text-center text-2xl">Order Confirmed!</CardTitle>
                <CardDescription className="text-center">
                  Your order has been placed successfully. Thank you for shopping with us!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Order Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Payment Method: {paymentMethod === PaymentMethod.ON_DELIVERY ? "Pay on Delivery" : "Credit Card (Stripe)"}
                    </p>
                    {shippingInfo && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Delivery Address</h3>
                        <p className="text-sm text-muted-foreground">
                          {shippingInfo.fullName}<br />
                          {shippingInfo.address}<br />
                          {shippingInfo.city}, {shippingInfo.zipCode}<br />
                          Phone: {shippingInfo.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/")} className="w-full">
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="md:col-span-2">
          <OrderSummary 
            items={cartItems} 
            totalPrice={totalPrice} 
            showItems={step !== CheckoutStep.CONFIRMATION} 
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
