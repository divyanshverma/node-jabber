/**
 * Created by divyanshverma on 6/16/15.
 */
var xmpp = require('node-xmpp');
var uuid = require('node-uuid');
var _ = require("underscore");
var ltx = require('ltx')
_.str = require('underscore.string');
_.str.include('Underscore.string', 'string');


var connection = new xmpp.Client({
    jid: '', //username
    password: '', //password
    host: '' //jabber host, in this case cisco jabber
});

connection.connection.socket.setTimeout(0)
connection.connection.socket.setKeepAlive(true, 10000)

connection.on('online', function (data) {
    console.log(data)
    console.log('Connected as ' + data.jid.user + '@' + data.jid.domain + '/' + data.jid.resource)


    connection.send(new xmpp.Element(
        'iq',
        {to: 'ge.com', type: 'get', id: uuid.v4()}
    ).c('query', {xmlns: "http://jabber.org/protocol/disco#info"}).up());

    connection.send(new xmpp.Element(
        'iq',
        {to: 'ge.com', type: 'get', id: uuid.v4()}
    ).c('query', {xmlns: "http://jabber.org/protocol/disco#items"}).up());

    connection.send(new xmpp.Element(
        'iq',
        {type: 'get'}
    ).c('query', {xmlns: "jabber:iq:roster"}).up());

    connection.send(new xmpp.Element(
        'iq',
        {to: 'ge.com', type: 'set', id: uuid.v4()}
    ).c('query', {xmlns: "http://jabber.org/protocol/disco#items"}).up());

    connection.send(new xmpp.Element(
        'iq',
        {to: 'consvr.isj2.webex.com', type: 'get', id: uuid.v4()}
    ).c('query', {xmlns: "http://jabber.org/protocol/disco#info"}).up());

    connection.send(new xmpp.Element(
        'iq',
        {to: 'aol-address-mapper.isj2.webex.com', type: 'get', id: uuid.v4()}
    ).c('query', {xmlns: "http://jabber.org/protocol/disco#info"}).up());

    connection.send(new xmpp.Element(
        'iq',
        {to: 'proxy.isj2.webex.com', type: 'get', id: uuid.v4()}
    ).c('query', {xmlns: "http://jabber.org/protocol/disco#info"}).up());

    connection.send(new xmpp.Element(
        'iq',
        {to: 'conference.isj2.webex.com', type: 'get', id: uuid.v4()}
    ).c('query', {xmlns: "http://jabber.org/protocol/disco#info"}).up());

    connection.send(new xmpp.Element(
        'presence',
        {}
    ).c('show').t('chat').up()
        .c('status').t('Available').up()
        .c('c', {
            xmlns: "http://jabber.org/protocol/caps", hash: "sha-1",
            node: "http://jabber.cisco.com/caxl",
            ver: "peSg/diinD4hk1+P8In1cxAYpfE="
        }).up());
});

connection.on('stanza', function (stanza) {
    console.log("\n\n")

    console.log('Incoming stanza: ', JSON.stringify(stanza));
    var _to = stanza.attrs.from;

    // Check if the incoming is an invite to a group chat
    if (stanza.is('message') && stanza.attrs.type !== 'chat'
        && stanza.children[0].name === 'x' && stanza.children[1].name === 'invite') {//stanza.children[1].name === 'invite'

        console.log('children stanza: ', stanza.children[2].attrs.jid);

        //console.log('children stanza: ', stanza.children[1].name);

        var room = stanza.children[2].attrs.jid;
        var nick = 'servicenow bot';


        connection.send(new xmpp.Element(
            'presence',
            {to: room + '/' + nick}
        ).c('x', {xmlns: "http://jabber.org/protocol/muc"}).up());

    }
    
    //check if the message from a groupchat
    if (stanza.is('message') && stanza.attrs.type === 'groupchat') {

        var message = stanza.getChildText('body');
        message = _.str.trim(message)
        message = _.str.capitalize(message);

       if (stanza.attrs.from.toString().indexOf(_to) === -1)
            consume(stanza, message);


    }
    
    //check if the message from an individual
    if (stanza.is('message') && stanza.attrs.type === 'chat') {

        //console.log('Sending response: ' + stanza.root().toString())

        var message = stanza.getChildText('body');
        message = _.str.trim(message)
        message = _.str.capitalize(message);

        if (stanza.attrs.from.toString().indexOf(_to) === -1)
            consume(stanza, message); //Consume the message as you like 

    }

})
/*** Consume the message as you like ******/

function consume(stanza, message) {

    console.log('Message : ' + message)

    var _to = stanza.attrs.from;
    var _from = stanza.attrs.to;
    var _type = 'chat';

    if (stanza.attrs.type === 'groupchat') {
        var f = stanza.attrs.from.toString();
        _to = f.substring(0, f.indexOf('/'));
        console.log('To Group : ' + _to)
        _type = 'groupchat';
    }

    if (message == 'Hi' || message == 'Hello' || message == 'Hi there') {
        var reply = new ltx.Element('message', {
            to: _to,
            from: _from,
            type: _type
        })
        reply.c('body').t('Hello, I am a bot. How may I help you ?')//isNaN(i) ? '' : ('' + (i + 1))
        setTimeout(function () {
            connection.send(reply)
        }, 1000)
    }
}

connection.on('error', function (e) {
    console.error(e)
})
