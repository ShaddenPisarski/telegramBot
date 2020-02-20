const Bluebird = require('bluebird');


module.exports = {
    message: function(ctx) {
        return new Bluebird(function(resolve){
            const message = ctx.update.message.text;

            switch(message) {
                case /test/: console.log(message); resolve(ctx.reply('test')); break;
                case /^\/\S*/ : resolve(backupComands(message));

            }
        });
    }
};

function backupComands(text) {

    const substring = text.match(/^\/\S*/);
    const commands = {
        getMyId: function (ctx) {
            return new Bluebird(function (resolve) {
                resolve(ctx.reply(ctx.update.message.from.id));
            });
        },
        getMyGroupId: function (ctx) {
            return new Bluebird(function(resolve){
                resolve(ctx.reply(ctx.update.message.chat.id));
            });
        },
        getMyName: function (ctx) {
            return new Bluebird(function(resolve){
                resolve(ctx.reply('First name: ' + ctx.update.message.from.first_name + '\nLast name: ' + ctx.update.message.from.last_name));
            });
        },
        fuck: function (ctx) {
            return new Bluebird(function(resolve){
                resolve(ctx.reply('If you are so so eager to see some porn...\n https://pornhub.com/video?o=mv'));
            });
        },
        easterEgg: function (ctx) {
            return new Bluebird(function(resolve){
                resolve(ctx.reply('❤'));
            });
        },
        help: function(ctx) {

            const helpMessage=  '/getMyId: Get your Telegram ID.\n\n' +
                '/getMyGroupId: Get the Id from the group.\n\n' +
                '/getMyName: Get your first and last name.\n\n' +
                'The comands above are available for every Telegram user. If you want to use more functions from this chatbot, send a request to @ShaddenPisarski\n\n';
            return new Bluebird(function(resolve){
                resolve(ctx.reply(helpMessage));
            });
        }
    }

    return new Bluebird(function(resolve) {
        resolve(commands.substring)
    });
}