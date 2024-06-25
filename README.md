# webhook-listener-service

## Overview

`webhook-listener-service` is a GitHub repository designed to demonstrate and implement security best practices within a software development lifecycle. This repository includes examples of GitHub Webhook listner and to monitor GitHub Organization events. And once any repository is created this listner will call the GitHub APIs for branch protection and the listener will apply branch protection to the new created repository. It will alsonotify the security team by creating issues.

## Features

- **Branch Protection Rules**: Implements branch protection rules to safeguard the main branch from unauthorized changes.
- **Webhook Integration**: Demonstrates the use of webhooks for enhanced security and automation, for e.g. automatic branch protection rule application and issue creation for tracking.

## Getting Started and SetUp

1. To get started with `webhook-listener-service`, clone this repository to your local machine:

    git clone https://github.com/gomtip-myorg/webhook-listener-service.git

2. Go inside the root folder
    cd webhook-listener-service
    
3. Install the required packages (express, body-parser, axios):
    npm install express body-parser axios dotenv

4. create .env file in the root of your repository and provide your token, org name, and user to be notified
   
    GITHUB_TOKEN=YOUR_GITHUB_TOKEN
    ORG_NAME=YOUR_GITHUB_ORG_NAME
    PORT=3000
    NOTIFY_USER=NOTIFY_USER

5. Run the server locally
    node index.js

6. Test the server running status.

    http://localhost:3000/status

# Deployment option
You can deploy this Node.js app on the environment of your choice, such as Azure, AWS, or on-premises. The only requirement is that the server URL should be publicly accessible, as it will be configured as a listener in the GitHub organization's webhook settings.

# Set Up GitHub Webhook
To make this app listen to you GitHub Org. We need to do some settings.
1. Create a Webhook in Your GitHub Organization:
2. Go to the settings of your GitHub organization.
3. Navigate to Webhooks and click on Add webhook.
4. Set the Payload URL to your Service URL (e.g., https://your-app-name.azurewebsites.net/webhook).
5. Set the Content type to application/json.
6. Choose Let me select individual events and select Repository events.
7. Click Add webhook.

# Test the Solution
1. Create a new Repository to trigger the Webhook.
2. Go to the new repository created
3. Navigate to Settings > Branches to verify that branch protection is applied.
4. Check the Issues tab to verify that an issue was created with the expected title and body.