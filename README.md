### Discord Message & Friend Removal scripts

This bot is a tool to help message all of your friends, DMs, and group chats OR remove all of your friends.
This can be useful when clearing out an account, or in many other use cases like sending all of your friends your new account, etc.

### WARNING
This is a selfbot. Selfbots are against Discord's TOS and may result in a warning or ban. I do not claim any responsibility if this occurs and you are using this at your own risk. This is for educational purposes only.

### Configuration

Before using, you must change your configuration in ``config.json``.
By default, ``TIMINGS.messages`` is set to 2000ms, and ``TIMINGS.relationships`` is set to 1000ms. 

You MUST set your ``TOKEN``, as all scripts utilize this for connecting to the Discord API.
An optional step is to set a message, however if you are going to use the messaging script you must set the ``MESSAGE`` value also.

Another feature is the ``BLACKLIST`` array. Each string in this array represents a Discord User ID.
Adding an ID to the ``BLACKLIST`` will prevent the bot from sending a message to anything involving them.

### Usage

You must first run ``yarn`` or ``npm install`` in order to install all the required dependencies. 

You can run the message script by typing into your terminal/command prompt:

```yarn message``` OR ```npm run message```


You can run the friend removal script by typing into your terminal/command prompt: 

```yarn friends``` OR  ```npm run friends```



