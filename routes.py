from flask import render_template, request, redirect, url_for, flash, jsonify, session
from datetime import datetime, timedelta
import secrets
import json
from app import app, db
from models import User, Campaign, EmailTemplate, CampaignTarget, UserInteraction, EducationalContent
from email_service import send_phishing_email, test_email_connection
from sqlalchemy import func

@app.route('/')
def dashboard():
    # Get dashboard statistics
    total_campaigns = Campaign.query.count()
    active_campaigns = Campaign.query.filter_by(status='active').count()
    total_users = User.query.count()
    
    # Get recent campaigns
    recent_campaigns = Campaign.query.order_by(Campaign.created_at.desc()).limit(5).all()
    
    # Calculate success rates for recent campaigns
    campaign_stats = []
    for campaign in recent_campaigns:
        total_targets = len(campaign.targets)
        interactions = UserInteraction.query.filter_by(campaign_id=campaign.id).count()
        success_rate = (interactions / total_targets * 100) if total_targets > 0 else 0
        campaign_stats.append({
            'campaign': campaign,
            'success_rate': round(success_rate, 1),
            'total_targets': total_targets,
            'interactions': interactions
        })
    
    return render_template('dashboard.html', 
                         total_campaigns=total_campaigns,
                         active_campaigns=active_campaigns,
                         total_users=total_users,
                         campaign_stats=campaign_stats)

@app.route('/campaigns')
def campaigns():
    campaigns = Campaign.query.order_by(Campaign.created_at.desc()).all()
    return render_template('campaigns.html', campaigns=campaigns)

@app.route('/campaigns/create', methods=['GET', 'POST'])
def create_campaign():
    if request.method == 'POST':
        campaign = Campaign(
            name=request.form['name'],
            description=request.form['description'],
            template_id=request.form['template_id']
        )
        db.session.add(campaign)
        db.session.commit()
        
        # Add targets
        target_emails = request.form['target_emails'].split('\n')
        for email in target_emails:
            email = email.strip()
            if email:
                user = User.query.filter_by(email=email).first()
                if user:
                    target = CampaignTarget(
                        campaign_id=campaign.id,
                        user_id=user.id,
                        tracking_token=secrets.token_urlsafe(32)
                    )
                    db.session.add(target)
        
        campaign.total_targets = len(target_emails)
        db.session.commit()
        
        flash('Campaign created successfully!', 'success')
        return redirect(url_for('campaigns'))
    
    templates = EmailTemplate.query.all()
    users = User.query.all()
    return render_template('create_campaign.html', templates=templates, users=users)

@app.route('/campaigns/<int:campaign_id>/start')
def start_campaign(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    
    # Test email connection first
    if not test_email_connection():
        flash('Email service is not properly configured. Please check your email settings.', 'error')
        return redirect(url_for('campaigns'))
    
    campaign.status = 'active'
    campaign.started_at = datetime.utcnow()
    
    # Send emails to all targets
    successful_sends = 0
    failed_sends = 0
    
    for target in campaign.targets:
        if not target.email_sent:
            success = send_phishing_email(campaign, target)
            if success:
                target.email_sent = True
                target.sent_at = datetime.utcnow()
                campaign.emails_sent += 1
                successful_sends += 1
            else:
                failed_sends += 1
    
    db.session.commit()
    
    if failed_sends == 0:
        flash(f'Campaign started successfully! {successful_sends} emails sent to targets.', 'success')
    elif successful_sends > 0:
        flash(f'Campaign partially started. {successful_sends} emails sent, {failed_sends} failed.', 'warning')
    else:
        flash(f'Campaign failed to start. Could not send any emails. Please check email configuration.', 'error')
    
    return redirect(url_for('campaigns'))

@app.route('/campaigns/<int:campaign_id>')
def view_campaign(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    
    # Get campaign statistics
    total_targets = len(campaign.targets)
    email_opens = UserInteraction.query.filter_by(
        campaign_id=campaign.id, 
        interaction_type='email_opened'
    ).count()
    
    link_clicks = UserInteraction.query.filter_by(
        campaign_id=campaign.id, 
        interaction_type='link_clicked'
    ).count()
    
    form_submissions = UserInteraction.query.filter_by(
        campaign_id=campaign.id, 
        interaction_type='form_submitted'
    ).count()
    
    # Calculate rates
    open_rate = (email_opens / total_targets * 100) if total_targets > 0 else 0
    click_rate = (link_clicks / total_targets * 100) if total_targets > 0 else 0
    success_rate = (form_submissions / total_targets * 100) if total_targets > 0 else 0
    
    # Get recent interactions
    recent_interactions = UserInteraction.query.filter_by(
        campaign_id=campaign.id
    ).order_by(UserInteraction.timestamp.desc()).limit(10).all()
    
    return render_template('campaign_detail.html', 
                         campaign=campaign,
                         total_targets=total_targets,
                         email_opens=email_opens,
                         link_clicks=link_clicks,
                         form_submissions=form_submissions,
                         open_rate=round(open_rate, 1),
                         click_rate=round(click_rate, 1),
                         success_rate=round(success_rate, 1),
                         recent_interactions=recent_interactions)

@app.route('/campaigns/<int:campaign_id>/edit', methods=['GET', 'POST'])
def edit_campaign(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    
    if request.method == 'POST':
        campaign.name = request.form['name']
        campaign.description = request.form['description']
        campaign.template_id = request.form['template_id']
        
        db.session.commit()
        flash('Campaign updated successfully!', 'success')
        return redirect(url_for('view_campaign', campaign_id=campaign.id))
    
    templates = EmailTemplate.query.all()
    users = User.query.all()
    return render_template('edit_campaign.html', campaign=campaign, templates=templates, users=users)

@app.route('/campaigns/<int:campaign_id>/analytics')
def campaign_analytics(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    
    # Get detailed analytics data
    interactions_by_type = db.session.query(
        UserInteraction.interaction_type,
        func.count(UserInteraction.id).label('count')
    ).filter_by(campaign_id=campaign.id).group_by(UserInteraction.interaction_type).all()
    
    # Get timeline data (interactions over time)
    timeline_data = db.session.query(
        func.date(UserInteraction.timestamp).label('date'),
        UserInteraction.interaction_type,
        func.count(UserInteraction.id).label('count')
    ).filter_by(campaign_id=campaign.id).group_by(
        func.date(UserInteraction.timestamp),
        UserInteraction.interaction_type
    ).order_by(func.date(UserInteraction.timestamp)).all()
    
    return render_template('campaign_analytics.html', 
                         campaign=campaign,
                         interactions_by_type=interactions_by_type,
                         timeline_data=timeline_data)

@app.route('/templates')
def templates():
    templates = EmailTemplate.query.order_by(EmailTemplate.created_at.desc()).all()
    return render_template('template_builder.html', templates=templates)

@app.route('/templates/create', methods=['GET', 'POST'])
def create_template():
    if request.method == 'POST':
        template = EmailTemplate(
            name=request.form['name'],
            subject=request.form['subject'],
            sender_name=request.form['sender_name'],
            sender_email=request.form['sender_email'],
            html_content=request.form['html_content'],
            text_content=request.form['text_content'],
            template_type=request.form['template_type']
        )
        db.session.add(template)
        db.session.commit()
        flash('Template created successfully!', 'success')
        return redirect(url_for('templates'))
    
    return render_template('template_builder.html')

@app.route('/analytics')
def analytics():
    # Get campaign analytics data
    campaigns = Campaign.query.all()
    analytics_data = []
    
    for campaign in campaigns:
        total_targets = len(campaign.targets)
        if total_targets > 0:
            email_opens = UserInteraction.query.filter_by(
                campaign_id=campaign.id, 
                interaction_type='email_opened'
            ).count()
            
            link_clicks = UserInteraction.query.filter_by(
                campaign_id=campaign.id, 
                interaction_type='link_clicked'
            ).count()
            
            form_submissions = UserInteraction.query.filter_by(
                campaign_id=campaign.id, 
                interaction_type='form_submitted'
            ).count()
            
            open_rate = (email_opens / total_targets) * 100
            click_rate = (link_clicks / total_targets) * 100
            success_rate = (form_submissions / total_targets) * 100
            
            analytics_data.append({
                'campaign': campaign,
                'total_targets': total_targets,
                'open_rate': round(open_rate, 1),
                'click_rate': round(click_rate, 1),
                'success_rate': round(success_rate, 1),
                'email_opens': email_opens,
                'link_clicks': link_clicks,
                'form_submissions': form_submissions
            })
    
    return render_template('analytics.html', analytics_data=analytics_data)

@app.route('/analytics/api/data')
def analytics_api():
    # Return analytics data as JSON for charts
    campaigns = Campaign.query.all()
    data = {
        'campaign_names': [],
        'open_rates': [],
        'click_rates': [],
        'success_rates': []
    }
    
    for campaign in campaigns:
        total_targets = len(campaign.targets)
        if total_targets > 0:
            email_opens = UserInteraction.query.filter_by(
                campaign_id=campaign.id, 
                interaction_type='email_opened'
            ).count()
            
            link_clicks = UserInteraction.query.filter_by(
                campaign_id=campaign.id, 
                interaction_type='link_clicked'
            ).count()
            
            form_submissions = UserInteraction.query.filter_by(
                campaign_id=campaign.id, 
                interaction_type='form_submitted'
            ).count()
            
            data['campaign_names'].append(campaign.name)
            data['open_rates'].append(round((email_opens / total_targets) * 100, 1))
            data['click_rates'].append(round((link_clicks / total_targets) * 100, 1))
            data['success_rates'].append(round((form_submissions / total_targets) * 100, 1))
    
    return jsonify(data)

@app.route('/users')
def users():
    users = User.query.order_by(User.created_at.desc()).all()
    return render_template('users.html', users=users)

@app.route('/users/create', methods=['POST'])
def create_user():
    user = User(
        username=request.form['username'],
        email=request.form['email'],
        first_name=request.form['first_name'],
        last_name=request.form['last_name'],
        department=request.form['department']
    )
    db.session.add(user)
    db.session.commit()
    flash('User created successfully!', 'success')
    return redirect(url_for('users'))

@app.route('/education')
def education():
    content = EducationalContent.query.filter_by(is_active=True).order_by(EducationalContent.created_at.desc()).all()
    return render_template('education.html', content=content)

@app.route('/phish/<token>')
def phishing_page(token):
    # Track the link click
    target = CampaignTarget.query.filter_by(tracking_token=token).first()
    if target:
        interaction = UserInteraction(
            campaign_id=target.campaign_id,
            user_id=target.user_id,
            tracking_token=token,
            interaction_type='link_clicked',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        db.session.add(interaction)
        db.session.commit()
    
    return render_template('phishing_page.html', token=token)

@app.route('/phish/<token>/submit', methods=['POST'])
def phishing_submit(token):
    # Track form submission
    target = CampaignTarget.query.filter_by(tracking_token=token).first()
    if target:
        submitted_data = {
            'username': request.form.get('username', ''),
            'password': request.form.get('password', ''),
            'email': request.form.get('email', ''),
            'additional_data': dict(request.form)
        }
        
        interaction = UserInteraction(
            campaign_id=target.campaign_id,
            user_id=target.user_id,
            tracking_token=token,
            interaction_type='form_submitted',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string,
            submitted_data=json.dumps(submitted_data)
        )
        db.session.add(interaction)
        db.session.commit()
        
        # Redirect to education page
        return redirect(url_for('education') + '?simulated=true')
    
    return redirect(url_for('education'))

@app.route('/test-email')
def test_email():
    """Test email functionality"""
    success = test_email_connection()
    if success:
        flash('✓ Email service is working correctly!', 'success')
    else:
        flash('✗ Email service connection failed. Please check your email configuration.', 'error')
    return redirect(url_for('campaigns'))

@app.route('/track/<token>/open.gif')
def track_email_open(token):
    # Track email open
    target = CampaignTarget.query.filter_by(tracking_token=token).first()
    if target:
        interaction = UserInteraction(
            campaign_id=target.campaign_id,
            user_id=target.user_id,
            tracking_token=token,
            interaction_type='email_opened',
            ip_address=request.remote_addr,
            user_agent=request.user_agent.string
        )
        db.session.add(interaction)
        db.session.commit()
    
    # Return 1x1 transparent GIF
    from flask import Response
    gif_data = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x04\x01\x00\x3b'
    return Response(gif_data, mimetype='image/gif')
