FROM ubuntu:24.04

# Required for nodejs 15+
WORKDIR /tests

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        apt-utils \
        wget \
        unzip \
        curl \
        npm \
        jq \
        default-jre \
        libxkbcommon0 \
        libpangocairo-1.0 \
        libxdamage1 \
        libgbm1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY ./tests/*.bat /tests/
COPY ./tests/*.js /tests/
COPY ./tests/*.csv /tests/
COPY ./tests/*.ext /tests/

RUN npm install jsdom@19.0.0 jquery jquery-csv unzipper node-fetch@2.6.1 selenium-webdriver

# Get Chrome for Testing - Chrome stable version
RUN CHROME_URL=$(curl -s https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json | jq -r '.channels.Stable.downloads.chrome[] | select(.platform == "linux64") | .url') && \
    curl -sSLf --retry 3 --output /tmp/chrome-linux64.zip "$CHROME_URL" && \
    unzip /tmp/chrome-linux64.zip -d /opt && \
    ln -s /opt/chrome-linux64/chrome /usr/local/bin/chrome && \
    rm /tmp/chrome-linux64.zip

# Get Chromedriver for Testing - matching Chrome version
RUN CHROMEDRIVER_URL=$(curl -s https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json | jq -r '.channels.Stable.downloads.chromedriver[] | select(.platform == "linux64") | .url') && \
    curl -sSLf --retry 3 --output /tmp/chromedriver-linux64.zip "$CHROMEDRIVER_URL" && \
    unzip -o /tmp/chromedriver-linux64.zip -d /tmp && \
    rm -rf /tmp/chromedriver-linux64.zip && \
    mv -f /tmp/chromedriver-linux64/chromedriver "/usr/local/bin/chromedriver" && \
    chmod +x "/usr/local/bin/chromedriver"

RUN chmod +x /tests/RunAllTests-Chrome-Linux.bat /tests/Cleanup-Docker.bat /tests/Buildup-Docker.bat && \
    sed -i 's/\r//' /tests/*.bat
