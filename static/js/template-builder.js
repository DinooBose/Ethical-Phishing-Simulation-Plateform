// Email Template Builder with Drag & Drop Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeTemplateBuilder();
    setupTemplateInteractions();
});

function initializeTemplateBuilder() {
    // Initialize template editor if modal exists
    const templateModal = document.getElementById('templateModal');
    if (templateModal) {
        setupTemplateEditor();
        setupTemplatePreviews();
    }
    
    // Setup existing template interactions
    setupTemplateCards();
}

function setupTemplateEditor() {
    const htmlContentTextarea = document.getElementById('htmlContent');
    const textContentTextarea = document.getElementById('textContent');
    const templateTypeSelect = document.getElementById('templateType');
    
    if (htmlContentTextarea) {
        // Add line numbers and syntax highlighting simulation
        htmlContentTextarea.addEventListener('input', function() {
            updateTemplatePreview();
            syncTextContent();
        });
        
        // Add tab support for better editing
        htmlContentTextarea.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                
                this.value = this.value.substring(0, start) + 
                           '    ' + this.value.substring(end);
                
                this.selectionStart = this.selectionEnd = start + 4;
            }
        });
    }
    
    if (templateTypeSelect) {
        templateTypeSelect.addEventListener('change', function() {
            updateTemplateTypeHints();
        });
    }
}

function setupTemplatePreviews() {
    // Add live preview functionality
    const previewButton = document.createElement('button');
    previewButton.type = 'button';
    previewButton.className = 'btn btn-outline-info btn-sm me-2';
    previewButton.innerHTML = '<i data-feather="eye" class="me-1"></i>Preview';
    previewButton.onclick = showTemplatePreview;
    
    const modalFooter = document.querySelector('#templateModal .modal-footer');
    if (modalFooter) {
        modalFooter.insertBefore(previewButton, modalFooter.firstChild);
    }
}

function setupTemplateCards() {
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

function loadTemplate(templateType) {
    const templates = {
        corporate: {
            subject: 'Urgent: IT Security Update Required',
            senderName: 'IT Security Team',
            senderEmail: 'security@company.com',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Security Update Required</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { padding: 20px; font-size: 12px; color: #666; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; margin: 15px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 Security Update Required</h1>
        </div>
        <div class="content">
            <p>Dear {{USER_NAME}},</p>
            
            <div class="warning">
                <strong>⚠️ URGENT SECURITY NOTICE</strong><br>
                We have detected suspicious login attempts on your corporate account.
            </div>
            
            <p>Our security systems have flagged unusual activity associated with your email address: <strong>{{USER_EMAIL}}</strong></p>
            
            <p>To protect your account and company data, please verify your identity immediately by clicking the button below:</p>
            
            <p style="text-align: center;">
                <a href="{{PHISHING_LINK}}" class="button">🔐 Verify Account Security</a>
            </p>
            
            <p><strong>Important:</strong> You have 24 hours to complete this verification before your account is temporarily suspended for security purposes.</p>
            
            <p>If you have any questions, please contact the IT Help Desk immediately.</p>
            
            <p>Best regards,<br>
            IT Security Team<br>
            Your Company Name</p>
        </div>
        <div class="footer">
            <p>This is an automated security notification. Please do not reply to this email.</p>
            <p>© 2025 Your Company Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
            textContent: `URGENT: IT Security Update Required

Dear {{USER_NAME}},

⚠️ URGENT SECURITY NOTICE
We have detected suspicious login attempts on your corporate account.

Our security systems have flagged unusual activity associated with your email address: {{USER_EMAIL}}

To protect your account and company data, please verify your identity immediately by visiting: {{PHISHING_LINK}}

Important: You have 24 hours to complete this verification before your account is temporarily suspended for security purposes.

If you have any questions, please contact the IT Help Desk immediately.

Best regards,
IT Security Team
Your Company Name`
        },
        
        financial: {
            subject: 'Immediate Action Required: Suspicious Account Activity',
            senderName: 'Bank Security Center',
            senderEmail: 'security@bankname.com',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bank Security Alert</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #1e3a8a; color: white; padding: 25px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; }
        .content { padding: 30px; }
        .alert-box { background: #fef3c7; border: 2px solid #f59e0b; color: #92400e; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .account-info { background: #f3f4f6; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .footer { background: #f9fafb; padding: 20px; font-size: 12px; color: #6b7280; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏦 SecureBank</div>
            <h2>Security Alert Notice</h2>
        </div>
        <div class="content">
            <p>Dear {{USER_NAME}},</p>
            
            <div class="alert-box">
                <h3>🚨 SUSPICIOUS ACTIVITY DETECTED</h3>
                <p>We have identified unusual transactions on your account that require immediate verification.</p>
            </div>
            
            <div class="account-info">
                <strong>Account Information:</strong><br>
                Email: {{USER_EMAIL}}<br>
                Alert Time: $(date)<br>
                Risk Level: HIGH
            </div>
            
            <p>For your security, we have temporarily limited access to your online banking. To restore full access, please verify your identity immediately.</p>
            
            <p style="text-align: center;">
                <a href="{{PHISHING_LINK}}" class="button">🔐 VERIFY ACCOUNT NOW</a>
            </p>
            
            <p><strong>⏰ Time Sensitive:</strong> You must complete verification within 6 hours or your account will be suspended pending investigation.</p>
            
            <p>If you did not initiate these transactions, please contact our fraud department immediately at 1-800-BANK-HELP.</p>
            
            <p>Thank you for banking with SecureBank.</p>
            
            <p>Sincerely,<br>
            SecureBank Security Team</p>
        </div>
        <div class="footer">
            <p>This alert was sent to {{USER_EMAIL}} for account security purposes.</p>
            <p>SecureBank will never ask for your password via email or phone.</p>
            <p>© 2025 SecureBank. Member FDIC. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
            textContent: `🏦 SecureBank - Security Alert Notice

Dear {{USER_NAME}},

🚨 SUSPICIOUS ACTIVITY DETECTED
We have identified unusual transactions on your account that require immediate verification.

Account Information:
Email: {{USER_EMAIL}}
Alert Time: $(date)
Risk Level: HIGH

For your security, we have temporarily limited access to your online banking. To restore full access, please verify your identity immediately by visiting: {{PHISHING_LINK}}

⏰ Time Sensitive: You must complete verification within 6 hours or your account will be suspended pending investigation.

If you did not initiate these transactions, please contact our fraud department immediately at 1-800-BANK-HELP.

Thank you for banking with SecureBank.

Sincerely,
SecureBank Security Team`
        },
        
        delivery: {
            subject: 'Package Delivery Failed - Action Required',
            senderName: 'FedEx Delivery Service',
            senderEmail: 'delivery@fedex.com',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Package Delivery Notice</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #4c1d95; color: white; padding: 20px; }
        .logo { font-size: 20px; font-weight: bold; color: #ff6600; }
        .content { padding: 25px; }
        .package-info { background: #f0f9ff; border: 1px solid #0284c7; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .button { display: inline-block; background: #ff6600; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; margin: 15px 0; font-weight: bold; }
        .tracking { font-family: monospace; background: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 16px; }
        .footer { background: #1f2937; color: white; padding: 20px; font-size: 12px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📦 FedEx</div>
            <h2>Delivery Notification</h2>
        </div>
        <div class="content">
            <p>Dear {{USER_NAME}},</p>
            
            <p>We attempted to deliver your package but were unable to complete the delivery.</p>
            
            <div class="package-info">
                <h3>📋 Package Details</h3>
                <strong>Recipient:</strong> {{USER_NAME}}<br>
                <strong>Email:</strong> {{USER_EMAIL}}<br>
                <strong>Tracking Number:</strong> <span class="tracking">FX9876543210</span><br>
                <strong>Delivery Attempts:</strong> 3 of 3
            </div>
            
            <p><strong>Reason for failed delivery:</strong> Recipient not available, invalid address verification required.</p>
            
            <p>Your package is currently being held at our local facility. To schedule a redelivery or pickup, please update your delivery preferences:</p>
            
            <p style="text-align: center;">
                <a href="{{PHISHING_LINK}}" class="button">📦 Update Delivery Details</a>
            </p>
            
            <p><strong>⚠️ Important:</strong> Packages are held for 5 business days only. After this period, the package will be returned to sender.</p>
            
            <p>You can also track your package status online or contact customer service at 1-800-GO-FEDEX.</p>
            
            <p>Thank you for choosing FedEx.</p>
            
            <p>FedEx Delivery Team</p>
        </div>
        <div class="footer">
            <p>This delivery notification was sent to {{USER_EMAIL}}</p>
            <p>© 2025 Federal Express Corporation. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
            textContent: `📦 FedEx - Delivery Notification

Dear {{USER_NAME}},

We attempted to deliver your package but were unable to complete the delivery.

📋 Package Details
Recipient: {{USER_NAME}}
Email: {{USER_EMAIL}}
Tracking Number: FX9876543210
Delivery Attempts: 3 of 3

Reason for failed delivery: Recipient not available, invalid address verification required.

Your package is currently being held at our local facility. To schedule a redelivery or pickup, please update your delivery preferences: {{PHISHING_LINK}}

⚠️ Important: Packages are held for 5 business days only. After this period, the package will be returned to sender.

You can also track your package status online or contact customer service at 1-800-GO-FEDEX.

Thank you for choosing FedEx.

FedEx Delivery Team`
        },
        
        security: {
            subject: 'Security Alert: New Login from Unrecognized Device',
            senderName: 'Account Security',
            senderEmail: 'security@microsoft.com',
            htmlContent: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Security Alert</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #323130; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #0078d4; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .security-alert { background: #fef2f2; border: 2px solid #ef4444; color: #991b1b; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .device-info { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; margin: 15px 0; border-radius: 8px; }
        .button { display: inline-block; background: #0078d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 5px; font-weight: 600; }
        .button.secondary { background: #6b7280; }
        .footer { background: #f3f4f6; padding: 20px; font-size: 12px; color: #6b7280; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Microsoft Security Alert</h1>
        </div>
        <div class="content">
            <p>Hello {{USER_NAME}},</p>
            
            <div class="security-alert">
                <h3>🚨 Unusual Sign-in Activity Detected</h3>
                <p>We detected a sign-in to your Microsoft account from a device we don't recognize.</p>
            </div>
            
            <div class="device-info">
                <h4>📱 Sign-in Details</h4>
                <strong>Email:</strong> {{USER_EMAIL}}<br>
                <strong>Time:</strong> Today at 2:34 PM EST<br>
                <strong>Location:</strong> Unknown Location<br>
                <strong>Device:</strong> Unknown Device<br>
                <strong>Browser:</strong> Chrome on Windows
            </div>
            
            <p>If this was you, you can safely ignore this email. If you don't recognize this activity, your account may be compromised.</p>
            
            <p><strong>Recommended Actions:</strong></p>
            <ul>
                <li>Secure your account immediately</li>
                <li>Review recent account activity</li>
                <li>Update your password</li>
                <li>Enable two-factor authentication</li>
            </ul>
            
            <p style="text-align: center;">
                <a href="{{PHISHING_LINK}}" class="button">🔒 Secure My Account</a>
                <a href="#" class="button secondary">📋 Review Activity</a>
            </p>
            
            <p>If you need help, visit the Microsoft Security Center or contact support.</p>
            
            <p>Thanks,<br>
            The Microsoft Account Team</p>
        </div>
        <div class="footer">
            <p>This security alert was sent to {{USER_EMAIL}}</p>
            <p>Microsoft Corporation, One Microsoft Way, Redmond, WA 98052</p>
            <p>© 2025 Microsoft. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
            textContent: `🔐 Microsoft Security Alert

Hello {{USER_NAME}},

🚨 Unusual Sign-in Activity Detected
We detected a sign-in to your Microsoft account from a device we don't recognize.

📱 Sign-in Details
Email: {{USER_EMAIL}}
Time: Today at 2:34 PM EST
Location: Unknown Location
Device: Unknown Device
Browser: Chrome on Windows

If this was you, you can safely ignore this email. If you don't recognize this activity, your account may be compromised.

Recommended Actions:
- Secure your account immediately
- Review recent account activity  
- Update your password
- Enable two-factor authentication

To secure your account, visit: {{PHISHING_LINK}}

If you need help, visit the Microsoft Security Center or contact support.

Thanks,
The Microsoft Account Team`
        }
    };
    
    const template = templates[templateType];
    if (template) {
        document.getElementById('subject').value = template.subject;
        document.getElementById('senderName').value = template.senderName;
        document.getElementById('senderEmail').value = template.senderEmail;
        document.getElementById('htmlContent').value = template.htmlContent;
        document.getElementById('textContent').value = template.textContent;
        document.getElementById('templateType').value = templateType;
        
        updateTemplatePreview();
        
        // Show success message
        showNotification('Template loaded successfully!', 'success');
    }
}

function updateTemplatePreview() {
    // This would show a live preview of the email template
    // For now, we'll just update the character count
    const htmlContent = document.getElementById('htmlContent').value;
    const textContent = document.getElementById('textContent').value;
    
    // Add character count indicators
    updateCharacterCount('htmlContent', htmlContent.length);
    updateCharacterCount('textContent', textContent.length);
}

function updateCharacterCount(elementId, count) {
    let countElement = document.getElementById(elementId + 'Count');
    if (!countElement) {
        countElement = document.createElement('small');
        countElement.id = elementId + 'Count';
        countElement.className = 'form-text text-muted';
        document.getElementById(elementId).parentNode.appendChild(countElement);
    }
    countElement.textContent = `${count} characters`;
}

function syncTextContent() {
    // Auto-generate text content from HTML
    const htmlContent = document.getElementById('htmlContent').value;
    const textContentField = document.getElementById('textContent');
    
    if (htmlContent && textContentField.value.trim() === '') {
        // Simple HTML to text conversion
        const textContent = htmlContent
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        
        textContentField.value = textContent;
    }
}

function showTemplatePreview() {
    const htmlContent = document.getElementById('htmlContent').value;
    const subject = document.getElementById('subject').value;
    
    // Create preview window
    const previewWindow = window.open('', 'templatePreview', 'width=800,height=600,scrollbars=yes');
    
    // Replace placeholders with sample data
    let previewContent = htmlContent
        .replace(/\{\{USER_NAME\}\}/g, 'John Doe')
        .replace(/\{\{USER_EMAIL\}\}/g, 'john.doe@example.com')
        .replace(/\{\{PHISHING_LINK\}\}/g, '#simulation-link');
    
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Email Preview: ${subject}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .preview-header { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                .preview-content { border: 1px solid #ddd; border-radius: 5px; overflow: hidden; }
            </style>
        </head>
        <body>
            <div class="preview-header">
                <h3>📧 Email Preview</h3>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Note:</strong> This is a preview with sample data. Actual emails will use real recipient data.</p>
            </div>
            <div class="preview-content">
                ${previewContent}
            </div>
        </body>
        </html>
    `);
    
    previewWindow.document.close();
}

function updateTemplateTypeHints() {
    const templateType = document.getElementById('templateType').value;
    const hints = {
        corporate: 'Focus on IT security, company policies, and urgent business matters.',
        financial: 'Use banking terminology, account security, and financial urgency.',
        social: 'Leverage social media platforms, friend requests, and social interactions.',
        delivery: 'Package delivery issues, shipping confirmations, and logistics.',
        security: 'Account security alerts, login notifications, and authentication.',
        other: 'Custom template - be creative but maintain realism.'
    };
    
    let hintElement = document.getElementById('templateTypeHint');
    if (!hintElement) {
        hintElement = document.createElement('small');
        hintElement.id = 'templateTypeHint';
        hintElement.className = 'form-text text-info';
        document.getElementById('templateType').parentNode.appendChild(hintElement);
    }
    
    hintElement.innerHTML = `<i data-feather="info" class="small me-1"></i>${hints[templateType] || ''}`;
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

function setupTemplateInteractions() {
    // Add template management features
    setupTemplateSearch();
    setupTemplateActions();
}

function setupTemplateSearch() {
    // Add search functionality for templates
    const searchInput = document.querySelector('#templateSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const templateCards = document.querySelectorAll('.template-card');
            
            templateCards.forEach(card => {
                const title = card.querySelector('.card-header h6').textContent.toLowerCase();
                const type = card.querySelector('.badge').textContent.toLowerCase();
                const visible = title.includes(searchTerm) || type.includes(searchTerm);
                
                card.style.display = visible ? '' : 'none';
            });
        });
    }
}

function setupTemplateActions() {
    // Add event listeners for template actions
    window.previewTemplate = function(templateId) {
        showNotification('Template preview functionality would load template ' + templateId, 'info');
    };
    
    window.editTemplate = function(templateId) {
        showNotification('Template editing functionality would edit template ' + templateId, 'info');
    };
    
    window.duplicateTemplate = function(templateId) {
        showNotification('Template duplicated successfully!', 'success');
    };
    
    window.deleteTemplate = function(templateId) {
        if (confirm('Are you sure you want to delete this template?')) {
            showNotification('Template deleted successfully!', 'success');
        }
    };
}

function showNotification(message, type = 'info') {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Initialize Feather icons when modal is shown
document.addEventListener('shown.bs.modal', function() {
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadTemplate,
        updateTemplatePreview,
        showTemplatePreview,
        updateTemplateTypeHints
    };
}
