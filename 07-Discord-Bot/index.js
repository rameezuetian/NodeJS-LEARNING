require('dotenv').config();
const {Client  , GatewayIntentBits }  = require("discord.js")
const { registerCommands } = require("./command")
const client = new Client({intents : [GatewayIntentBits.Guilds  , GatewayIntentBits.GuildMessages , GatewayIntentBits.MessageContent]})


client.once("clientReady" , () => {
    console.log(`Logged in as ${client.user.tag}`)
    registerCommands(client)
})

client.on("interactionCreate" , async interaction =>{
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === 'ping'){
        await interaction.reply({
            content: `Pong! ${client.ws.ping}ms`,
        });
    }
});

client.on("messageCreate" , message =>{
    if(message.author.bot) return;
    message.reply({
        content:"Hi From Bot",
    });

});

client.login(process.env.DISCORD_TOKEN);