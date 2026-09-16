const nodemailer = require('nodemailer');

const sendOrderConfirmationEmail = async (userEmail, userName, orderId, items, totalAmount) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPassword) {
      console.error('Order email skipped: EMAIL_USER and EMAIL_PASSWORD are required');
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    });

    // Format items for email
    const itemsHTML = items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: emailUser,
      to: userEmail,
      subject: `Order Confirmation - Order #${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1f2937; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background-color: #f9fafb; padding: 20px; }
            .order-id { background-color: #fff; padding: 15px; border-left: 4px solid #b45309; margin: 20px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background-color: #1f2937; color: white; padding: 10px; text-align: left; }
            .total-row { font-size: 18px; font-weight: bold; text-align: right; padding: 15px 0; border-top: 2px solid #ddd; }
            .footer { background-color: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
            .button { background-color: #1f2937; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Order Confirmed</h1>
              <p>Thank you for your purchase!</p>
            </div>
            
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Your order has been successfully placed. Here are your order details:</p>
              
              <div class="order-id">
                <strong>Order ID:</strong> ${orderId}<br>
                <strong>Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}<br>
                <strong>Status:</strong> <span style="color: #22c55e; font-weight: bold;">Confirmed</span>
              </div>
              
              <h3>Order Items:</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                  <tr>
                    <td colspan="3" style="padding: 10px; text-align: right;"><strong>Order Total:</strong></td>
                    <td style="padding: 10px; text-align: right; font-size: 18px; font-weight: bold;">₹${totalAmount.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
              
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>We will process your order shortly</li>
                <li>You will receive a shipping notification with tracking details</li>
                <li>Estimated delivery time: 3-5 business days</li>
              </ul>
              
              <p>If you have any questions, please contact our customer support team.</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">View Your Order</a>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} MENSWEAR. All rights reserved.</p>
              <p>This is an automated email. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to:', userEmail);
    return true;
  } catch (error) {
    console.error('Failed to send order email:', error.message);
    return false;
  }
};

module.exports = { sendOrderConfirmationEmail };
