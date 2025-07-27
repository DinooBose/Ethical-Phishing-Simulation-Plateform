# Phishing Simulation Platform

## Overview

This is a Flask-based web application designed for cybersecurity education and training through phishing simulations. The platform allows organizations to create, manage, and analyze phishing simulation campaigns to improve employee security awareness. The application includes features for creating phishing email templates, managing user targets, tracking campaign performance, and providing educational content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask web framework with Python
- **Database**: SQLAlchemy ORM with support for SQLite (development) and PostgreSQL (production)
- **Email Service**: Flask-Mail for sending phishing simulation emails
- **Session Management**: Flask sessions with configurable secret keys
- **Middleware**: ProxyFix for handling reverse proxy headers

### Frontend Architecture
- **Template Engine**: Jinja2 templating (Flask default)
- **CSS Framework**: Bootstrap 5.3.0 for responsive design
- **Icons**: Feather Icons for consistent iconography
- **Charts**: Chart.js for data visualization and analytics
- **JavaScript**: Vanilla JavaScript with modular organization

### Database Schema
The application uses SQLAlchemy models with the following main entities:
- **User**: Stores user information including name, email, department, and admin status
- **Campaign**: Manages phishing simulation campaigns with status tracking
- **EmailTemplate**: Stores reusable email templates for different phishing scenarios
- **CampaignTarget**: Links users to specific campaigns
- **UserInteraction**: Tracks user responses to phishing attempts (referenced but not fully implemented)
- **EducationalContent**: Provides security training materials (referenced but not implemented)

## Key Components

### Campaign Management
- Create and configure phishing simulation campaigns
- Select target users and email templates
- Track campaign status (draft, active, completed, paused)
- Monitor email delivery and user interactions

### Email Template System
- Pre-built phishing email templates for different scenarios
- Template categories (corporate, social, financial, etc.)
- Support for HTML and plain text content
- Variable substitution for personalization ({{USER_NAME}}, {{USER_EMAIL}}, {{PHISHING_LINK}})

### Analytics and Reporting
- Dashboard with campaign statistics
- Success rate tracking and visualization
- Performance comparison between campaigns
- Educational impact assessment

### User Management
- Employee directory with department organization
- Admin role management
- User interaction history tracking

### Security Education
- Educational content delivery after simulation exposure
- Best practice guidelines and training materials
- Interactive learning modules

## Data Flow

1. **Campaign Creation**: Administrators create campaigns by selecting templates and target users
2. **Email Generation**: System generates personalized phishing emails with tracking tokens
3. **Email Delivery**: Flask-Mail sends simulation emails to target users
4. **User Interaction**: Users receive emails and may click links or provide information
5. **Tracking**: System logs user interactions through tracking pixels and links
6. **Education**: Users are redirected to educational content after falling for simulations
7. **Analytics**: Data is aggregated for reporting and performance analysis

## External Dependencies

### Email Services
- **SMTP Configuration**: Supports Gmail and custom SMTP servers
- **Email Authentication**: TLS encryption and credential management
- **Delivery Tracking**: Integration with email tracking systems

### Frontend Libraries
- **Bootstrap 5.3.0**: UI framework from CDN
- **Feather Icons**: Icon library from CDN
- **Chart.js**: Data visualization from CDN

### Database Support
- **SQLite**: Default for development and testing
- **PostgreSQL**: Recommended for production deployment
- **Connection Pooling**: Configured for production reliability

## Deployment Strategy

### Environment Configuration
- Environment variables for sensitive configuration
- Separate settings for development and production
- Database URL configuration for different environments

### Production Considerations
- ProxyFix middleware for reverse proxy deployment
- Database connection pooling and health checks
- Session security with production-grade secret keys
- SMTP configuration for reliable email delivery

### Scalability Features
- SQLAlchemy ORM supports multiple database backends
- Modular Flask blueprint structure (ready for implementation)
- Configurable email service providers
- Stateless session management for horizontal scaling

### Security Measures
- Educational warnings in email subjects ([PHISHING SIMULATION])
- User consent and awareness protocols
- Secure session management
- Input validation and CSRF protection (framework defaults)

The application is designed as an educational tool with clear simulation warnings to ensure ethical use in cybersecurity training programs.
