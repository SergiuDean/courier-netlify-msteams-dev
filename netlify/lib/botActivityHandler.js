const { TurnContext, TeamsActivityHandler } = require("botbuilder");
const { CourierClient } = require("@trycourier/courier");
const courier = CourierClient();

class BotActivityHandler extends TeamsActivityHandler {
  constructor() {
    super();


    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      let conversationType = context.activity.conversation.conversationType;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
          if (membersAdded[cnt].id !== context.activity.recipient.id) {
              if (conversationType === 'personal') {
                  //member is added to personal channel
                  await context.sendActivity("Hello! And welcome to Gravity Teams Integration!");
              }
          } else if (conversationType !== 'personal') {
              //bot is added to channel, send welcome to channel
              await context.sendActivity(language.welcome_in_channel);
          }
      }
      await next();
  });

    // Registers an activity event handler for the message event, emitted for every incoming message activity.
    this.onMessage(async (context, next) => {
      TurnContext.removeRecipientMention(context.activity);
      const text = context.activity.text.trim().toLocaleLowerCase();
      if (text.toLowerCase().includes("channel")) {
        if (!context.activity.channelData.channel) {
          await context.sendActivity(
            `"channel" must be called inside a channel.`
          );
         return;
        }
        await context.sendActivity("Channel ID: "+context.activity.channelData.channel.id);
      } else if (text.toLowerCase().includes("test")) {
        await context.sendActivity(`Gravity bot has been successfully added.`);
      } else if (text.toLowerCase().includes("hi")) {
        await context.sendActivity(`Hello! Hope you're having a great day!`);
      } else if (text.toLowerCase().includes("hello")) {
        await context.sendActivity(`Hello! Hope you're having a great day!`);
      } else if (text.toLowerCase().includes("user")) {
        await context.sendActivity("User ID: "+context.activity.from.id);
      } else if (text.toLowerCase().includes("help")) {
        await context.sendActivity("If you call these commands from a channel use `@Gravity info` format.   \nBot must be added to a channel before calling.  \nAvailable commands: test, info, user, channel");
      } else if (text.toLowerCase().includes("info")) {
        const {
      serviceUrl: service_url,
      channelData: {
        tenant: { id: tenant_id }
      }
    } = context.activity;
        await context.sendActivity("Service URL: "+service_url+"  \nTenant ID: "+tenant_id);//+"\nuser id: "+context.activity.from.id
      } else {
        await context.sendActivity("Unknown command!  Available commands: test, info, user, channel");
      }

      await next();
    });
  }
}

module.exports.BotActivityHandler = BotActivityHandler;
