const Telegrambot = require('./telegrambot/telegramBot');
const fireAndForget = require('./telegrambot/fireAndForget');
const Bluebird = require('bluebird');
const musicFile = require('./scribbletune/scribbletune');
const commandos = require('./commandos');

const options = {
    token: '',
    chatRoomIds: [],
    // updateTypes: updateTypes,
    // listeners: {hey: 'hallo'},
    commands: commandos
};
console.log(commandos);
new Telegrambot(options).catch(console.log);