
import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CheckoutCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  icon: React.ReactNode
  active?: boolean
  onClick?: () => void
}

const CheckoutCard = React.forwardRef<HTMLDivElement, CheckoutCardProps>(
  ({ title, description, icon, active, onClick, className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-md cursor-pointer",
          active ? "ring-2 ring-cafePurple border-transparent" : "hover:border-cafePurple/30",
          "animate-scale-in",
          className
        )}
        onClick={onClick}
        {...props}
      >
        <div className={cn(
          "absolute top-0 left-0 h-1 transition-all duration-300",
          active ? "bg-cafePurple w-full" : "w-0"
        )} />
        
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "p-2 rounded-full transition-colors",
              active ? "bg-cafePurple text-white" : "bg-muted text-muted-foreground"
            )}>
              {icon}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <CardDescription className="pt-2">{description}</CardDescription>
        </CardHeader>
        
        <CardContent>{children}</CardContent>
        
        <CardFooter>
          <div className="w-full">
            {active && (
              <div className="w-full py-2 text-center text-sm text-cafePurple animate-fade-in">
                Selected
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    )
  }
)
CheckoutCard.displayName = "CheckoutCard"

export { CheckoutCard }
