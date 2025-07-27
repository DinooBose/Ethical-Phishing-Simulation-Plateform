from flask_mail import Mail, Message
from app import app
import logging

# Initialize Flask-Mail
mail = Mail()
mail.init_app(app)

def send_phishing_email(campaign, target):
    """Send a phishing simulation email to a target user"""
    try:
        # Check if mail configuration is properly set
        if not app.config.get('MAIL_USERNAME') or not app.config.get('MAIL_PASSWORD'):
            logging.error('Email credentials not configured. Please set MAIL_USERNAME and MAIL_PASSWORD.')
            return False
            
        template = campaign.template
        user = target.user
        
        logging.info(f'Preparing email for {user.email} using template "{template.name}"')
        
        # Replace placeholders in template
        html_content = template.html_content or ''
        text_content = template.text_content or ''
        
        # Add tracking pixel
        base_url = app.config.get("SERVER_URL", "http://localhost:5000")
        tracking_pixel = f'<img src="{base_url}/track/{target.tracking_token}/open.gif" width="1" height="1" style="display:none;">'
        html_content += tracking_pixel
        
        # Replace phishing link placeholder
        phishing_link = f'{base_url}/phish/{target.tracking_token}'
        html_content = html_content.replace('{{PHISHING_LINK}}', phishing_link)
        text_content = text_content.replace('{{PHISHING_LINK}}', phishing_link)
        
        # Replace user placeholders
        user_name = f'{user.first_name or ""} {user.last_name or ""}'.strip() or user.username
        html_content = html_content.replace('{{USER_NAME}}', user_name)
        html_content = html_content.replace('{{USER_EMAIL}}', user.email)
        text_content = text_content.replace('{{USER_NAME}}', user_name)
        text_content = text_content.replace('{{USER_EMAIL}}', user.email)
        
        # Create message
        sender_email = template.sender_email or app.config.get('MAIL_USERNAME')
        
        msg = Message(
            subject=f'[PHISHING SIMULATION] {template.subject}',
            sender=(template.sender_name, sender_email),
            recipients=[user.email],
            html=html_content,
            body=text_content
        )
        
        logging.info(f'Sending email from {sender_email} to {user.email}')
        mail.send(msg)
        logging.info(f'✓ Simulation email successfully sent to {user.email} for campaign "{campaign.name}"')
        return True
        
    except Exception as e:
        logging.error(f'✗ Failed to send simulation email to {target.user.email}: {str(e)}')
        logging.error(f'Email config - Server: {app.config.get("MAIL_SERVER")}, Port: {app.config.get("MAIL_PORT")}, Username: {app.config.get("MAIL_USERNAME")[:5]}***')
        return False

def test_email_connection():
    """Test email configuration"""
    try:
        # Log configuration (without sensitive data)
        logging.info(f'Testing email connection to {app.config.get("MAIL_SERVER")}:{app.config.get("MAIL_PORT")}')
        logging.info(f'Using username: {app.config.get("MAIL_USERNAME")}')
        
        with mail.connect() as conn:
            logging.info('✓ Email connection test successful')
            return True
    except Exception as e:
        error_msg = str(e)
        logging.error(f'✗ Email connection test failed: {error_msg}')
        
        # Provide helpful error messages
        if "Username and Password not accepted" in error_msg:
            logging.error('Gmail requires an App Password, not your regular password.')
            logging.error('Visit: https://support.google.com/accounts/answer/185833')
        elif "Authentication failed" in error_msg:
            logging.error('Check your email credentials in the secrets.')
        
        return False
