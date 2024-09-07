**Build Image:**
x

```bash
docker build -t wa-bot-img . --build-arg SSH_KEY="$(cat ~/.ssh/id_rsa)" --no-cache
```

**Run the container:**

```bash
docker run -d --name wa-ai-bot -p 3000:3000 wa-bot-img
```
