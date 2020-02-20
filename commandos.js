const Bluebird = require('bluebird');
const musicFile = require('./scribbletune/scribbletune');

module.exports = {
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
    // makeMusic: function (ctx) {
    //     return new Bluebird(function(resolve) {
    //         const message = ctx.update.message.text;
    //         const replacedCommand = message.replace(/^\/\S*/, '');
    //         if(replacedCommand){
    //            const fileName = musicFile(replacedCommand);
    //            console.log('ctx', ctx.replyWithAudio);
    //             // resolve(ctx.replyWithAudio({source: fileName}));
    //         }
    //     });
    // },
    help: function(ctx) {

        const helpMessage=  '/getMyId: Get your Telegram ID.\n\n' +
                            '/getMyGroupId: Get the Id from the group.\n\n' +
                            '/getMyName: Get your first and last name.\n\n' +
                            'The commands above are available for every Telegram user. If you want to use more functions from this chatbot, send a request to @ShaddenPisarski\n\n';
        return new Bluebird(function(resolve){
            resolve(ctx.reply(helpMessage));
        });
    }
};