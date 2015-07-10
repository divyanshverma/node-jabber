# node-jabber
This is a nodejs client for cisco jabber/webexconnect. This is based on node-xmpp package. 

Once running - it can do following:

1. Chat with other users in network
2. Group Chat with other users in network


Steps to configure before execution (client.js):

1. Put the JID, Password and Host for your Cisco Jabber user account. This could be a bot account as well.
2. Consume function is where you can write your own logic to process each incoming message. Your imagination is the answer :)
3. $ node client.js

Future changes :

1. Auto record messages in a group chat and append/feed it to any external system
2. Optimize handling of multiple active group chats
