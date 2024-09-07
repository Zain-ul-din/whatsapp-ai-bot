FROM node:20-alpine

RUN apk add --no-cache git openssh openssh-keygen openssl

# SSH setup

ARG SSH_KEY
ENV SSH_KEY=$SSH_KEY

RUN mkdir -p /root/.ssh && \
    chmod 700 /root/.ssh

# Create id_rsa from string arg, and set permissions

RUN echo "$SSH_KEY" > /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa

# RUN eval $(ssh-agent -s)
RUN echo "$SSH_KEY" > /root/.ssh/id_rsa
# RUN  echo "    IdentityFile ~/.ssh/id_rsa" >> /etc/ssh/ssh_config
# RUN echo -e "Host github.com\n  HostName github.com\n  User git\n  IdentityFile ~/.ssh/id_rsa" > /etc/ssh/ssh_config
# RUN echo -e "Host github.com\n  HostName github.com\n  User git\n  IdentityFile ~/.ssh/id_rsa" > ~/.ssh/config
# RUN chmod 600 ~/.ssh/id_rsa

# Create known_hosts
RUN touch /root/.ssh/known_hosts

# Add git providers to known_hosts
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
# RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts
# RUN ssh-keyscan gitlab.com >> /root/.ssh/known_hosts

# test

# RUN ssh -T git@github.com

## ---

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

COPY src ./src
COPY static ./static

RUN yarn

EXPOSE 3000

CMD ["yarn", "dev"]

