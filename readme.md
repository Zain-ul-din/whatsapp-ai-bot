<h1 align="center">
⚠ We are no longer maintaining this branch use <a href="https://github.com/Zain-ul-din/whatsapp-ai-bot/tree/baileys">this branch</a> instead.
</h1>

<br>

<div align="center">

<h1>
<img src="https://github.com/Zain-ul-din/whatsapp-ai-bot/assets/78583049/d31339cf-b4ae-450e-95b9-53d21e4641a0" width="35" height="35"/>
WhatsApp AI Bot 🚀</h1>
</div>

The WhatsApp AI Bot is a chatbot that uses AI models APIs to generate responses to user input. The bot supports several AI models, including **`Gemini`**, **`Gemini-Vision`**, **`CHAT-GPT`**, **`DALL-E`**, and **`Stability AI`**, and users can also create their **`own models`** to customize the bot's behavior.


 <table align="center">
  <thead>
  <tr>
   <th>♥ Sponsor</th>
   <th>💎 Bounty</th>
   <th>🚀 Deployment</th>
   <th>✉ WhatsApp Group</th>
  </tr>
  </thead>
  <tbody>
   <tr>
    <td align="center">
     <a href="https://buymeacoffee.com/zainuldin">
      link
     </a>
    </td>
    <td align="center">
     <a href="https://wa-ai-seven.vercel.app/feat-req">
      link
     </a>
    </td>
    <td align="center">
     <a href="https://wa-ai-seven.vercel.app/">
      link
     </a>
    </td>
    <td align="center">
     <a href="https://chat.whatsapp.com/DlVCpX2QQNx6jHQVT9IB7Z" align="center">link</a>
    </td>
   </tr>
  </tbody>
 </table>


# Table of Content

- [Demo.](#demo)
- [Usage.](#usage)
- [Tutorials.](#Tutorials)
- [Docs.](https://github.com/Zain-ul-din/WhatsApp-Ai-bot/blob/master/docs/config-docs.md)
- [Disclaimer.](#disclaimer)
- [Contributors.](#contributors)
- [Sponsors.](#Sponsors)
- [About.](#about-us)


# Demo

**Gemini**

[![Screenshot (1186)](https://github.com/Zain-ul-din/whatsapp-ai-bot/assets/78583049/b6f256de-c792-4947-bf65-401a60a0b1f4)](https://www.youtube.com/watch?v=dXDxTQQqeq8)


**Stability AI + Chat-GPT**

![image](https://user-images.githubusercontent.com/78583049/222071673-ef0f2021-a8b4-4263-9304-a77ecd76c0a1.png)

**Dalle + Custom Model** 

![image](https://user-images.githubusercontent.com/78583049/222074174-55792d13-5137-4c1c-b708-3ad188ca8d8d.png)


# Usage

**1. Download Source Code**

```bash
 git clone https://github.com/Zain-ul-din/WhatsApp-Ai-bot.git
 cd WhatsApp-Ai-bot
```

> OR

- [Download Zip File](https://github.com/Zain-ul-din/WhatsApp-Ai-bot/archive/refs/heads/master.zip)


**2. Get API Keys**

- [Gemini API Key](https://makersuite.google.com/app/apikey)
- [OpenAI API Key](https://platform.openai.com/account/api-keys)
- [StabilityAI API Key](https://platform.stability.ai/docs/getting-started/authentication)

**3. Add API Keys**

- create `.env` in the root of the project.

- set following fields in `.env` file
```.env
 OPENAI_API_KEY=YOUR_OPEN_AI_API_KEY
 DREAMSTUDIO_API_KEY=YOUR_STABILITY_AI_API_KEY
 GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

**4. Run the code**

- run `setup.sh` to start the bot.

- Scan QR code.

**Default Prefix**

- `!gemini` use gemini.
- `!gemini-vision` use `gemini-pro-vision` model for images
- `!chatgpt` use chat-gpt.
- `!dalle` use Dalle.
- `!stable` use Stability AI.
- `!bot` use custom model.

**Note! open `src/whatsapp-ai.config.ts` to edit config.**

[Docs Link](https://github.com/Zain-ul-din/WhatsApp-Ai-bot/blob/master/docs/config-docs.md)

# Tutorials

- **[Setup bot on cloud using Github code-spaces](https://www.youtube.com/watch?v=QahJSi6Ygj4)**
- **[setup bot on a local machine](https://www.youtube.com/watch?v=fyPD3ILFPck)**


### FQA

- [How to create custom model](https://github.com/Zain-ul-din/whatsapp-ai-bot/issues/3)


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

## Sponsors 

A big thank you to these people for supporting this project.

<table>
 <thead>
  <tr>
   <th>
    <img src="https://avatars.githubusercontent.com/u/47256157?v=4" width="150" height="150"/>
   </th>
   <th>
    <img src="https://avatars.githubusercontent.com/u/0?v=4" width="150" height="150"/>
   </th>
  </tr>
 </thead>
 <tbody>
   <tr>
    <td align="center">
     <a target="_blank" href="https://github.com/levitco">Levitco</a>
    💎
    </td>
    <td align="center">
    <a target="_blank" href="https://www.buymeacoffee.com/zainuldin">YOU?</a>
    </td>
   </tr>
 </tbody>
</table>

## About Us

<div align="center">
<h4 font-weight="bold">This repository is maintained by <a href="https://github.com/Zain-ul-din">Zain-Ul-Din</a></h4>
<p> Show some ❤️ by starring this awesome repository! </p>
</div>


<div align="center">
<a href="https://www.buymeacoffee.com/zainuldin" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

</div>
