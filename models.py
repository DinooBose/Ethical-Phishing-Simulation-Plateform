from datetime import datetime
from app import db
from sqlalchemy import func

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    department = db.Column(db.String(100))
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    interactions = db.relationship('UserInteraction', backref='user', lazy=True)

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    template_id = db.Column(db.Integer, db.ForeignKey('email_template.id'), nullable=False)
    status = db.Column(db.String(20), default='draft')  # draft, active, completed, paused
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    started_at = db.Column(db.DateTime)
    ended_at = db.Column(db.DateTime)
    total_targets = db.Column(db.Integer, default=0)
    emails_sent = db.Column(db.Integer, default=0)
    
    # Relationships
    template = db.relationship('EmailTemplate', backref='campaigns')
    interactions = db.relationship('UserInteraction', backref='campaign', lazy=True)
    targets = db.relationship('CampaignTarget', backref='campaign', lazy=True)

class EmailTemplate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(300), nullable=False)
    sender_name = db.Column(db.String(100))
    sender_email = db.Column(db.String(120))
    html_content = db.Column(db.Text)
    text_content = db.Column(db.Text)
    template_type = db.Column(db.String(50))  # corporate, social, financial, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CampaignTarget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    email_sent = db.Column(db.Boolean, default=False)
    sent_at = db.Column(db.DateTime)
    tracking_token = db.Column(db.String(100), unique=True)
    
    # Relationships
    user = db.relationship('User', backref='campaign_targets')

class UserInteraction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tracking_token = db.Column(db.String(100))
    interaction_type = db.Column(db.String(50))  # email_opened, link_clicked, form_submitted, attachment_downloaded
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.Text)
    submitted_data = db.Column(db.Text)  # JSON string of any form data submitted
    
class EducationalContent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text)
    content_type = db.Column(db.String(50))  # article, video, quiz, tip
    category = db.Column(db.String(100))  # phishing, social_engineering, best_practices
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
