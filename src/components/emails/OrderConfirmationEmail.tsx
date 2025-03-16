
import React from "react";

interface OrderConfirmationEmailProps {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    currency?: string;
  }>;
  totalPrice: number;
  orderDate: string;
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  fullName,
  address,
  city,
  zipCode,
  phone,
  items,
  totalPrice,
  orderDate,
}) => {
  // Format price with currency symbol
  const formatPrice = (price: number, currency = "USD") => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(price);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Order Confirmation</h1>
        <p style={styles.subtitle}>Thank you for your order!</p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Order Details</h2>
        <p><strong>Order Date:</strong> {orderDate}</p>
        <p><strong>Payment Method:</strong> Pay on Delivery</p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Shipping Address</h2>
        <p>{fullName}</p>
        <p>{address}</p>
        <p>{city}, {zipCode}</p>
        <p>Phone: {phone}</p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Order Summary</h2>
        {items.map((item) => (
          <div key={item.id} style={styles.item}>
            <div style={styles.itemImageContainer}>
              <img 
                src={item.image} 
                alt={item.name} 
                style={styles.itemImage} 
              />
            </div>
            <div style={styles.itemDetails}>
              <h3 style={styles.itemName}>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {formatPrice(item.price, item.currency)}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.total}>
        <h2 style={styles.totalText}>Total: {formatPrice(totalPrice)}</h2>
      </div>

      <div style={styles.footer}>
        <p>If you have any questions about your order, please contact our support team.</p>
        <p>Thank you for shopping with us!</p>
      </div>
    </div>
  );
};

// Styles for the email template
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center' as const,
    borderBottom: '2px solid #f5f5f7',
    paddingBottom: '20px',
    marginBottom: '20px',
  },
  title: {
    color: '#1D1D1F',
    fontSize: '28px',
    margin: '0 0 10px',
  },
  subtitle: {
    color: '#1D1D1F',
    fontSize: '16px',
    margin: '0',
  },
  section: {
    marginBottom: '25px',
    padding: '15px',
    backgroundColor: '#f5f5f7',
    borderRadius: '5px',
  },
  sectionTitle: {
    color: '#1D1D1F',
    fontSize: '18px',
    margin: '0 0 15px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '8px',
  },
  item: {
    display: 'flex',
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  itemImageContainer: {
    width: '80px',
    marginRight: '15px',
  },
  itemImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
  },
  itemDetails: {
    flex: '1',
  },
  itemName: {
    margin: '0 0 5px',
    fontSize: '16px',
  },
  total: {
    textAlign: 'right' as const,
    padding: '15px',
    backgroundColor: '#1D1D1F',
    borderRadius: '5px',
    color: '#ffffff',
  },
  totalText: {
    margin: '0',
    fontSize: '20px',
  },
  footer: {
    marginTop: '25px',
    padding: '15px',
    backgroundColor: '#f5f5f7',
    borderRadius: '5px',
    textAlign: 'center' as const,
    fontSize: '14px',
    color: '#666',
  },
};

export default OrderConfirmationEmail;
