# Zelle Advanced Edition

A comprehensive Zelle money transfer management platform for the United States, featuring real-time transaction processing, multi-language support, and advanced security features.

## Overview

This application provides a full-featured Zelle transfer system with:

- **Real-time Money Transfers**: Send and receive Zelle payments instantly
- **Multi-Language Support**: English and French language options
- **Admin Dashboard**: Comprehensive transaction management and reporting
- **Security Features**: Advanced authentication and fraud protection
- **US Bank Integration**: Support for major US financial institutions
- **Email Notifications**: Automated transfer confirmations via SendGrid

## Key Features

### User Features
- Send money to email addresses or phone numbers
- View transaction history and status
- Manage recipient list
- Multi-state support (all 50 US states + DC)
- Real-time balance tracking

### Admin Features
- Transaction monitoring and management
- Email template customization
- Analytics and reporting
- User management
- Security controls

### Supported Banks
- Chase Bank
- Bank of America
- Wells Fargo
- Citibank
- US Bank
- PNC Bank
- Capital One
- TD Bank
- Truist
- And many more US financial institutions

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Email**: SendGrid integration
- **State Management**: React Context API
- **Internationalization**: Custom i18n implementation

## Color Scheme

The application uses Zelle's signature purple branding:
- Primary: `#6D1ED4` (Zelle Purple)
- Accent: `#8B5CF6` (Light Purple)
- Dark: `#5B21B6` (Dark Purple)

## Environment Variables

Required environment variables:
- `SENDGRID_API_KEY`: SendGrid API key for email notifications
- `SENDGRID_FROM_EMAIL`: Sender email address
- `NEXT_PUBLIC_SENDER_EMAIL`: Public sender email
- `NEXT_PUBLIC_APP_URL`: Application URL

## Getting Started

This application is designed to run in the v0 preview environment with automatic dependency resolution.

## Currency

All transactions are processed in USD (United States Dollar).

## Support

For issues or questions, please refer to the in-app help documentation or contact support.

## License

Proprietary - All rights reserved
