require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// Initialize Express app
const app = express();
// Server port, default to 3000 if not specified in environment variables
const port = process.env.PORT || 3000;
// GitHub token and organization name from environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ORG_NAME = process.env.ORG_NAME;
const NOTIFY_USER = process.env.NOTIFY_USER; //user name to notify

// Middleware to parse JSON bodies
app.use(bodyParser.json());

/**
 * GET /status
 * Route to check if the server is running. It also displays the organization name being listened to.
 */
app.get('/status', (req, res) => {
    res.send('Server is running and ' + 'ready to receive events from your org -> ' + ORG_NAME);
});

/**
 * POST /webhook
 * Endpoint to handle GitHub webhook events for repository creation.
 * It sets branch protection rules and creates an issue in the newly created repository.
 */
app.post('/webhook', async (req, res) => {
    // Extract GitHub event type from the request headers
    const event = req.headers['x-github-event'];
    
    // Process only 'repository' events with 'created' action
    if (event === 'repository') {
        console.log('Received repository event');
        const action = req.body.action;
        if (action === 'created') {
            console.log('Received repository event');
            // Extract repository name and default branch from the request body
            const repoName = req.body.repository.name;
            const defaultBranch = req.body.repository.default_branch;
            console.log('repoName : ' + repoName);
            console.log('defaultBranch : ' + defaultBranch);
            // Construct URL for setting branch protection
            const url = `https://api.github.com/repos/${ORG_NAME}/${repoName}/branches/${defaultBranch}/protection`;

            // Branch protection rules
            const protectionRules = {
                required_status_checks: null,
                enforce_admins: true,
                required_pull_request_reviews: {
                    required_approving_review_count: 1,
                    require_code_owner_reviews: true,
                },
                restrictions: null,
            };

            try {
                // Apply branch protection rules
                await axios.put(url, protectionRules, {
                    headers: {
                        Authorization: `token ${GITHUB_TOKEN}`,
                        Accept: 'application/vnd.github.luke-cage-preview+json',
                    },
                });

                // Construct URL for creating an issue in the repository
                const issueUrl = `https://api.github.com/repos/${ORG_NAME}/${repoName}/issues`;
                // Issue content
                const issueBody = {
                    title: "Branch protection added",
                    body: `@${NOTIFY_USER} Branch protection has been enabled with the following rules:\n- Required approving reviews: 1\n- Enforce admins: true`,
                };

                // Create an issue in the repository
                await axios.post(issueUrl, issueBody, {
                    headers: {
                        Authorization: `token ${GITHUB_TOKEN}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                });
                
                // Respond with success message
                res.status(200).send('Branch protection applied and issue created.');
            } catch (error) {
                // Log and respond with error message in case of failure
                console.error(error);
                res.status(500).send('Error applying branch protection.');
            }
        }
    } else {
        // Respond with message for ignored events
        res.status(200).send('Event ignored.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});