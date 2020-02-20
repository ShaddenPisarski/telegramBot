const Bluebird = require('bluebird');
const Telegram = require('telegraf/telegram');

/**
 * Sends a message to a specific chat-room, or the first in the array
 * @param {string} message - The message that should be send
 * @param {object} [options] - The options for telegram bot
 * @param {string} [options.tokenId] - Token given from the BotFather
 * @param {string|string[]} [options.chatRoomIds] - The chatRoomId to where the message should be send
 * @returns {Bluebird} - resolve to object
 */
module.exports = function fireAndForget(message, options) {
    if (options && options.chatRoomIds && typeof options.chatRoomIds === 'array'){
        return Bluebird.resolve(options.chatRoomIds)
            .each(function (chatRoomId) {
                let chatRoomOptions = JSON.parse(JSON.stringify(options));
                chatRoomOptions.chatRoomId = chatRoomId;
                return sendMessageToChat(message, chatRoomOptions);
            });
    }
    else if (options && options.chatRoomId) {
        return sendMessageToChat(message, options);
    }
};

function sendMessageToChat(message, options) {
    const telegramOptions = {
        tokenId: options.tokenId,
        chatRoomId: options.chatRoomId
    };

    const telegram = new Telegram(telegramOptions.tokenId);
    const chatId = telegramOptions.chatRoomId;

    return new Bluebird(function (resolve, reject) {
        return telegram.getChat(chatId)
            .then(function (chat) {
                return telegram.sendMessage(chat.id, message)
                    .then(function () {
                        return resolve();
                    })
                    .catch(reject);
            });
    });
}
