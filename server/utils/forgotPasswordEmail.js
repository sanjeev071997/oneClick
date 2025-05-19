const ForgotPasswordEmail = (resetPasswordUrl, currentYear, userName) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Reset Your Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #f4f4f4;
                color: black;
                padding: 20px 0;
                text-align: center;
            }
            .header img {
                max-width: 100px;
                margin-bottom: 10px;
            }
           
            .content {
                padding: 20px;
                text-align: center;
            }
            .content h1 {
                color: #333;
                font-size: 24px;
            }
            .content p {
                font-size: 16px;
                line-height: 1.5;
                color: #666;
            }
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 24px;
                color: #ffffff;
                background-color: green;
                text-decoration: none;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
            }
            .footer {
                text-align: center;
                padding: 20px 0;
                border-top: 1px solid #e0e0e0;
                margin-top: 20px;
                font-size: 12px;
                color: #999;
            }
            .no-reply {
                font-size: 14px;
                color: #999;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${process.env.TEST_SERIES_LOGO}" alt="Your Logo">
                <h2>Welcome to XYZ!</h2>
            </div>
            <div class="content">
                <h1>Reset Your Password</h1>
                <p>Hello,<b> ${userName} </b></p>
                <p>We received a request to reset your password. Click the button below to reset it:</p>
                <a href="${resetPasswordUrl}"class="button">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                <p>Thank you,<br>The XYZ Team</p>
            </div>
            <div class="footer">
                <p>&copy; ${currentYear} XYZ. All rights reserved.</p>
                <p>If you have any questions, feel free to contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a></p>
                <p class="no-reply">Please do not reply to this email. This inbox is not monitored.</p>
            </div>
        </div>
    </body>
    </html>`;
    };
    
    export default ForgotPasswordEmail;