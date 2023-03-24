<div align="center">
<h1>WhatsApp AI Bot</h1>
</div>

![Banner (1)](https://user-images.githubusercontent.com/78583049/222102919-9d09417d-7e44-4efd-b482-f5893c7bc5f6.png)

### The WhatsApp AI Bot is a chatbot that uses AI models APIs to generate responses to user input. The bot supports several AI models, including **`CHAT-GPT`**, **`DALL-E`**, and **`Stability AI`**, and users can also create their **`own models`** to customize the bot's behavior.

### Tutorials
- **[Setup bot on cloud using Github codespaces](https://www.youtube.com/watch?v=QahJSi6Ygj4)**
- **[setup bot on a local machine](https://www.youtube.com/watch?v=fyPD3ILFPck)**

### FQA

- [How to create custom model](https://github.com/Zain-ul-din/whatsapp-ai-bot/issues/3)

# Table of Content

- [Demo.](#demo)
- [Features.](#features)
- [Requirements.](#requirements)
- [Usage.](#usage)
- [Docs.](https://github.com/Zain-ul-din/WhatsApp-Ai-bot/blob/master/docs/config-docs.md)
- [Disclaimer.](#disclaimer)
- [Contributors.](#contributors)
- [About.](#about-us)

# Demo

**Stability AI + Chat-GPT**

![image](https://user-images.githubusercontent.com/78583049/222071673-ef0f2021-a8b4-4263-9304-a77ecd76c0a1.png)

**Dalle + Custom Model** 

![image](https://user-images.githubusercontent.com/78583049/222074174-55792d13-5137-4c1c-b708-3ad188ca8d8d.png)


# Features
- Generate text responses to user input using various AI models.
- Support for GPT, DALL-E, StabilityAI, and other models via API integration.
- Easy-to-use API for creating custom AI models and integrating with the bot.
- Integration with WhatsApp for easy deployment and messaging.

# Requirements

- Node.js (18 or newer)
- A recent version of yarn.
- An OpenAI API and StabilityAI API key. 
- A WhatsApp account.


# Usage

**1. Download Source Code**

```bash
 git clone https://github.com/Zain-ul-din/WhatsApp-Ai-bot.git
 cd WhatsApp-Ai-bot
```

> OR

- [Download Zip File](https://github.com/Zain-ul-din/WhatsApp-Ai-bot/archive/refs/heads/master.zip)


**2. Get API Keys**

- [OpenAI API Key](https://platform.openai.com/account/api-keys)
- [StabilityAI API Key](https://platform.stability.ai/docs/getting-started/authentication)

**3. Add API Keys**


- create `.env` in the root of the project.

- set following fields in `.env` file
```.env
 OPENAI_API_KEY=YOUR_OPEN_AI_API_KEY
 DREAMSTUDIO_API_KEY=YOUR_STABILITY_AI_API_KEY
```

**4. Run the code**

- run `setup.sh` to start the bot.

- Scan QR code.

**Default Prefix**

- `!chatgpt` use chat-gpt.
- `!dalle` use Dalle.
- `!stable` use Stability AI.
- `!bot` use custom model.

**Note! open `src/whatsapp-ai.config.ts` to edit config.**

[Docs Link](https://github.com/Zain-ul-din/WhatsApp-Ai-bot/blob/master/docs/config-docs.md)

# Disclaimer

This bot utilizes Puppeteer to operate an actual instance of Whatsapp Web to prevent blocking. However, it is essential to note that these operations come at a cost charged by OpenAI and Stability AI for every request made. Please be aware that WhatsApp does not support bots or unofficial clients on its platform, so using this method is not entirely secure and could lead to getting blocked.


## Contributors

<a href="https://github.com/Zain-ul-din/WhatsApp-Ai-bot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Zain-ul-din/WhatsApp-Ai-bot" />
</a>

###

- [Open issue here](https://github.com/Zain-ul-din/WhatsApp-Ai-bot/issues)
- [Ask Question here](https://github.com/Zain-ul-din/WhatsApp-Ai-bot/discussions)

<!-- about -->

## About Us

<div align="center">
<h4 font-weight="bold">This repository is maintained by <a href="https://github.com/Zain-ul-din">Zain-Ul-Din</a></h4>
<p> Show some ❤️ by starring this awesome repository! </p>
</div>

