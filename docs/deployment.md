**Build Image:**

```bash
docker build -t my-node-app . --build-arg SSH_KEY="$(cat ~/.ssh/id_rsa)" --no-cache
```

**Run the container:**

```bash
docker run -d --name wa-ai -p 3000:3000 my-node-app
```
