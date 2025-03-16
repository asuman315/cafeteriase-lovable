import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Truck, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import ShippingForm from "@/components/ShippingForm";
import OrderSummary from "@/components/OrderSummary";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import DeliveryPreferencesForm from "@/components/DeliveryPreferencesForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

enum CheckoutStep {
  SELECT_METHOD,
  DELIVERY_PREFERENCES,
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
  const [deliveryPreferences, setDeliveryPreferences] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please sign in to proceed with checkout");
      navigate("/auth", { state: { returnTo: "/checkout" } });
    }
  }, [user, authLoading, navigate]);

  const createStripeCheckoutSession = async () => {
    try {
      setIsLoading(true);
      
      const successUrl = `${window.location.origin}/checkout?success=true`;
      const cancelUrl = `${window.location.origin}/checkout?canceled=true`;

      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          items: cartItems,
          customerEmail: user?.email,
          successUrl,
          cancelUrl,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to create checkout session");
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to process payment", {
        description: error.message || "Please try again or contact support",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const canceled = urlParams.get("canceled");

    if (success === "true") {
      setStep(CheckoutStep.CONFIRMATION);
      clearCart();
      window.history.replaceState({}, document.title, "/checkout");
    } else if (canceled === "true") {
      toast.error("Payment was canceled", {
        description: "You can try again or choose a different payment method",
      });
      setPaymentMethod(null);
      setStep(CheckoutStep.SELECT_METHOD);
      window.history.replaceState({}, document.title, "/checkout");
    }
  }, [clearCart]);

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === PaymentMethod.ON_DELIVERY) {
      setStep(CheckoutStep.SHIPPING_INFO);
    } else {
      createStripeCheckoutSession();
    }
  };

  const handleDeliveryPreferencesSubmit = (values: any) => {
    setDeliveryPreferences(values);
    setStep(CheckoutStep.SHIPPING_INFO);
  };

  const handleShippingInfoSubmit = (values: any) => {
    setShippingInfo(values);
    toast.success("Order placed successfully!", {
      duration: 2000,
    });
    setStep(CheckoutStep.CONFIRMATION);
    clearCart();
  };

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

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
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
          {step === CheckoutStep.DELIVERY_PREFERENCES && "Please provide your delivery preferences."}
          {step === CheckoutStep.SHIPPING_INFO && "Please provide your delivery information."}
          {step === CheckoutStep.CONFIRMATION && "Thank you for your order!"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className={`md:col-span-${step === CheckoutStep.CONFIRMATION ? "5" : "3"}`}>
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
                  <Button 
                    onClick={() => handleSelectPaymentMethod(PaymentMethod.STRIPE)} 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {step === CheckoutStep.DELIVERY_PREFERENCES && (
            <DeliveryPreferencesForm onSubmit={handleDeliveryPreferencesSubmit} />
          )}

          {step === CheckoutStep.SHIPPING_INFO && (
            <ShippingForm onSubmit={handleShippingInfoSubmit} />
          )}

          {step === CheckoutStep.CONFIRMATION && (
            <Card className="animate-scale-in mx-auto max-w-xl">
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
                    {deliveryPreferences && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-2">Delivery Preferences</h3>
                        <p className="text-sm text-muted-foreground">
                          Phone: {deliveryPreferences.phone}<br />
                          District: {deliveryPreferences.district}<br />
                          {deliveryPreferences.email && `Email: ${deliveryPreferences.email}`}<br />
                          {deliveryPreferences.city && `City/Town: ${deliveryPreferences.city}`}<br />
                          Preferred Delivery Time: {deliveryPreferences.deliveryTime}
                        </p>
                      </div>
                    )}
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

        {step !== CheckoutStep.CONFIRMATION && (
          <div className="md:col-span-2">
            <OrderSummary 
              items={cartItems} 
              totalPrice={totalPrice} 
              showItems={true} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
