const {REST , Routes, SlashCommandBuilder} = require("discord.js")

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .toJSON(),
]

async function registerCommands(client){
    const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN)
    
    try {
        console.log("Registering commands...")
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        )
        console.log("Commands registered!")
    } catch(error){
        console.error(error)
    }
}

module.exports = { registerCommands }