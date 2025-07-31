const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// ChannelAdvisor OAuth callback handler
app.get('/auth/channeladvisor/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    console.log('🎉 ChannelAdvisor OAuth callback received!');
    console.log('Authorization Code:', code);
    console.log('State:', state);
    
    if (code) {
      // Exchange authorization code for tokens
      try {
        const tokenResponse = await axios.post('https://api.channeladvisor.com/oauth2/token', {
          grant_type: 'authorization_code',
          code: code,
          client_id: process.env.CHANNELADVISOR_CLIENT_ID,
          client_secret: process.env.CHANNELADVISOR_CLIENT_SECRET,
          redirect_uri: process.env.CHANNELADVISOR_REDIRECT_URI
        });
        
        console.log('\n✅ Token Exchange Successful!');
        console.log('Access Token:', tokenResponse.data.access_token);
        console.log('Refresh Token:', tokenResponse.data.refresh_token);
        console.log('Token Type:', tokenResponse.data.token_type);
        console.log('Expires In:', tokenResponse.data.expires_in, 'seconds');
        
        // Update .env file with refresh token
        console.log('\n📝 Add this to your .env file:');
        console.log(`CHANNELADVISOR_REFRESH_TOKEN=${tokenResponse.data.refresh_token}`);
        
        res.html(`
          <html>
            <body>
              <h2>✅ ChannelAdvisor Authorization Successful!</h2>
              <p><strong>Refresh Token:</strong> ${tokenResponse.data.refresh_token}</p>
              <p>Copy the refresh token above to your .env file</p>
              <p>You can close this window now.</p>
            </body>
          </html>
        `);
        
      } catch (tokenError) {
        console.error('❌ Token exchange failed:', tokenError.response?.data || tokenError.message);
        res.send(`
          <h2>❌ Token Exchange Failed</h2>
          <p>Error: ${tokenError.message}</p>
          <p>Check console for details</p>
        `);
      }
    } else {
      res.send(`
        <h2>❌ No Authorization Code Received</h2>
        <p>The OAuth flow didn't complete properly</p>
      `);
    }
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).send('OAuth callback failed');
  }
});

// Webhook handler
app.use('/webhooks', require('./src/webhooks/channeladvisor-webhook'));

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 OAuth callback server running on port ${PORT}`);
  console.log(`🔗 Callback URL: https://afe85cba9c26.ngrok.app/auth/channeladvisor/callback`);
  console.log(`🪝 Webhook URL: https://afe85cba9c26.ngrok.app/webhooks/channeladvisor`);
  console.log('\n📋 Ready to receive ChannelAdvisor OAuth tokens!');
});