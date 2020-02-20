const Telegraf = require('telegraf');
const Bluebird = require('bluebird');
const fireAndForget = require('./fireAndForget');

/**
 * @param {object} options  -  Object of parameter {'token': string, 'chatRoomId': string}
 * @param {string} options.token - Token given from the BotFather
 * @param {string[]} options.chatRoomIds - Ids from the chatroom
 * @param {Objects[]} [options.updateTypes] - key + bluebird-function - react to special message Types See {@link https://telegraf.js.org/#/?id=update-types}
 * @param {Objects} [options.listeners] - key: values - resolve to bluebird. react to the key with the given value. I.e. {hi: 'hello'}
 * @param {Objects} [options.commands] - key: values - resolve to bluebird. react to the key with the given value. I.e. {/start: start bot}
 */
module.exports = function TelegramBot(options) {
    const telegramBot = this;
    const token = options.token;
    const chatRoomIds = options.chatRoomIds;
    const telegraf = new Telegraf(token);

    let logStack = [];

    /**
     * Extract informations from the context object and save it in the log stack
     * @param {object} ctx - The context object for the current message
     */
    function logRequest(ctx) {
        const contextSaveObject = {
            From: ctx.update.message.from.first_name + ',' + ctx.update.message.from.last_name || null,
            isBot: ctx.update.message.from.is_bot || false,
            userId: ctx.update.message.from.id || null,
            chatId: ctx.update.message.chat.id || null,
            chatTitle: ctx.update.message.chat.title || null,
            chatType: ctx.update.message.chat.type || null,
            message: ctx.update.message.text || null,
            date: ctx.update.message.date || new Date()
        };

        logStack.push(contextSaveObject);
    }

    /**
     * Check if the context is from a whitelisted user/group (specified in chatRoomIds)
     * @param {object }ctx - The context object for the current message
     */
    function isWhitelisted(ctx) {
        return !!(ctx
            && ctx.update
            && ctx.update.message
            && ctx.update.message.chat
            && ctx.update.message.chat.id
            && chatRoomIds.indexOf(ctx.update.message.chat.id.toString()) > -1);
    }

    /**
     * Get the current token
     * @return string
     */
    this.getToken = function getToken() {
        return token;
    };

    /**
     * Get the current chatRoomId
     * @return {string[]}
     */
    this.getChatRoomIds = function getChatRoomIds() {
        return chatRoomIds;
    };

    /**
     * Get the current log stack
     * @returns {Array}
     */
    this.getLogStack = function getLogStack() {
        return logStack;
    };

    /**
     * Empty the current log stack
     * @returns {boolean}
     */
    this.emptyLogStack = function emptyLogStack() {
        logStack = [];
        return true;
    };

    /**
     * Stop the bot
     * @return {Bluebird} - resolve to true
     */
    this.stopBot = function stopBot() {
        return new Bluebird(function (resolve) {
            return telegraf.stop(function () {
                return resolve(true);
            });
        });
    };

    /**
     * Sends a message to a specific chat-room, or the first in the array
     * @param {string} message - The message that should be send
     * @param {object} [options] - The options for telegram bot
     * @param {string} [options.tokenId] - Token given from the BotFather
     * @param {string[]} [options.chatRoomIds] - The chatRoomId to where the message should be send
     * @returns {Bluebird} - resolve to object
     */
    this.sendFireAndForget = function sendFireAndForget(message, options) {
        options = options || {};

        const telegramOptions = {
            tokenId: options.tokenId || token,
            chatRoomIds: options.chatRoomIds || chatRoomIds
        };

        return fireAndForget(message, telegramOptions);
    };

    // Create the listeners for specific commands i.e. '/start'
    if (options && options.commands) {
        for (let command in options.commands) {
            telegraf.command(command, function (ctx) {
                return new Bluebird(function (resolve) {
                    return resolve(options.commands[command](ctx));
                });
            });
        }
    }

    // Create the listeners for specific messages i.e. 'Hello'
    if (options && options.listeners) {
        for (let listener in options.listeners) {
            telegraf.hears(listener, function (ctx) {
                return new Bluebird(function (resolve, reject) {
                    if (isWhitelisted(ctx)) {

                        return ctx.reply(options.listeners[listener])
                            .then(resolve)
                            .catch(reject);

                    }
                    else {
                        logRequest(ctx);
                        resolve();
                    }
                });
            });
        }
    }

    // Creates the listeners for specific message types i.e. message, video or sticker
    if (options && options.updateTypes) {
        for (let updateType in options.updateTypes) {
            telegraf.on(updateType, function executeUpdateTypeResponse(ctx) {
                return new Bluebird(function (resolve) {
                    if (isWhitelisted(ctx)) {
                        resolve(options.updateTypes[updateType](ctx));
                    }
                    else {
                        logRequest(ctx);
                        resolve();
                    }
                });
            });
        }
    }

    // Initialize the bot an launch the listeners
    return new Bluebird(function (resolve, reject) {
        return telegraf.launch()
            .then(function () {
                return resolve(telegramBot);
            })
            .catch(reject);
    });
};
