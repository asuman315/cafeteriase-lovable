
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Home, CreditCard, ArrowLeft, Truck, ShieldCheck } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckoutCard } from "@/components/ui/checkout-card"
import { ShippingForm } from "@/components/ui/shipping-form"
import { OrderSummary } from "@/components/ui/order-summary"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"

enum CheckoutStep {
  SELECT_METHOD,
  PERSONAL_DELIVERY,
  PAYMENT_PROCESSING,
  CONFIRMATION
}

enum PaymentMethod {
  PERSONAL_DELIVERY,
  STRIPE
}

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState<CheckoutStep>(CheckoutStep.SELECT_METHOD)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Redirect if cart is empty
  if (cartItems.length === 0 && step !== CheckoutStep.CONFIRMATION) {
    navigate("/products")
    toast("Your cart is empty")
    return null
  }
  
  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method)
    if (method === PaymentMethod.PERSONAL_DELIVERY) {
      setStep(CheckoutStep.PERSONAL_DELIVERY)
    } else {
      setIsProcessing(true)
      // Simulate processing time for Stripe redirect
      setTimeout(() => {
        setStep(CheckoutStep.PAYMENT_PROCESSING)
        simulateStripePayment()
      }, 1500)
    }
  }
  
  const handleShippingSubmit = (data: any) => {
    setIsProcessing(true)
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false)
      setStep(CheckoutStep.CONFIRMATION)
      clearCart()
      toast.success("Your order has been placed successfully!")
    }, 2000)
  }
  
  const simulateStripePayment = () => {
    // This would be replaced with actual Stripe integration
    setTimeout(() => {
      setIsProcessing(false)
      setStep(CheckoutStep.CONFIRMATION)
      clearCart()
      toast.success("Payment successful!")
    }, 2000)
  }
  
  const goBack = () => {
    if (step === CheckoutStep.SELECT_METHOD) {
      navigate("/products")
    } else if (step === CheckoutStep.PERSONAL_DELIVERY) {
      setStep(CheckoutStep.SELECT_METHOD)
      setSelectedMethod(null)
    }
  }
  
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 animate-fade-in">
          {/* Header */}
          <div className="mb-8">
            {step !== CheckoutStep.CONFIRMATION && (
              <Button 
                variant="ghost" 
                className="mb-4 pl-0 text-muted-foreground" 
                onClick={goBack}
                disabled={isProcessing}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {step === CheckoutStep.SELECT_METHOD && "Checkout"}
              {step === CheckoutStep.PERSONAL_DELIVERY && "Delivery Details"}
              {step === CheckoutStep.PAYMENT_PROCESSING && "Processing Payment"}
              {step === CheckoutStep.CONFIRMATION && "Order Confirmation"}
            </h1>
            
            <p className="text-muted-foreground">
              {step === CheckoutStep.SELECT_METHOD && "Choose how you'd like to receive your order"}
              {step === CheckoutStep.PERSONAL_DELIVERY && "Please provide your delivery information"}
              {step === CheckoutStep.PAYMENT_PROCESSING && "Please wait while we process your payment"}
              {step === CheckoutStep.CONFIRMATION && "Thank you for your order!"}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-5">
            {/* Main Content */}
            <div className="md:col-span-3 space-y-6">
              {step === CheckoutStep.SELECT_METHOD && (
                <>
                  <CheckoutCard
                    title="Personal Delivery"
                    description="Get your order delivered directly to your door with our professional delivery service."
                    icon={<Truck className="h-6 w-6" />}
                    active={selectedMethod === PaymentMethod.PERSONAL_DELIVERY}
                    onClick={() => handleSelectMethod(PaymentMethod.PERSONAL_DELIVERY)}
                    className="mb-4"
                  >
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>• Delivery within 30 minutes</p>
                      <p>• Real-time tracking available</p>
                      <p>• Contactless delivery option</p>
                    </div>
                  </CheckoutCard>
                  
                  <CheckoutCard
                    title="Pay with Stripe"
                    description="Securely pay online with Stripe's trusted payment gateway."
                    icon={<CreditCard className="h-6 w-6" />}
                    active={selectedMethod === PaymentMethod.STRIPE}
                    onClick={() => handleSelectMethod(PaymentMethod.STRIPE)}
                  >
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>• Fast and secure checkout</p>
                      <p>• Support for all major credit cards</p>
                      <p>• End-to-end encryption</p>
                    </div>
                  </CheckoutCard>
                </>
              )}
              
              {step === CheckoutStep.PERSONAL_DELIVERY && (
                <ShippingForm 
                  onSubmit={handleShippingSubmit} 
                  isSubmitting={isProcessing}
                />
              )}
              
              {step === CheckoutStep.PAYMENT_PROCESSING && (
                <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-cafePurple border-t-transparent"></div>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Processing your payment</h2>
                  <p className="text-muted-foreground text-center max-w-md">
                    Please wait while we securely process your payment. Do not close this window.
                  </p>
                </div>
              )}
              
              {step === CheckoutStep.CONFIRMATION && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Order Confirmed!</h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {selectedMethod === PaymentMethod.PERSONAL_DELIVERY 
                      ? "Your order has been confirmed and will be delivered shortly." 
                      : "Your payment was successful and your order has been confirmed."}
                  </p>
                  
                  <Alert className="bg-muted/50 border-muted mb-6 max-w-md mx-auto text-left">
                    <AlertDescription>
                      A confirmation email has been sent to your email address.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    className="bg-cafePurple hover:bg-cafePurple-dark"
                    onClick={() => navigate("/")}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Return to Home
                  </Button>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            {step !== CheckoutStep.CONFIRMATION && (
              <div className="md:col-span-2">
                <div className="bg-muted/30 rounded-lg p-6 border">
                  <OrderSummary cartItems={cartItems} />
                  
                  {cartItems.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-sm font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Checkout
