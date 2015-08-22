FROM ubuntu:15.04
MAINTAINER david@adverway.com

# Install dependencies
RUN apt-get update && \
    apt-get install -y wget build-essential python-software-properties git

# Install node v0.10.23
RUN cd && wget https://nodejs.org/dist/v0.10.23/node-v0.10.23.tar.gz && \
    tar -xzvf node-v0.10.23.tar.gz && cd node-v0.10.23/ && \
    ./configure && make && make install

# Install gulp and bower
RUN npm install -g gulp bower

# Create working directory
ENV APP_HOME /ld33
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# Expose ports
EXPOSE 8080
EXPOSE 35729

# Add source code
ADD . $APP_HOME

CMD ["gulp", "dev"]
