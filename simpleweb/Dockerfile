# BASE IMAGE
FROM node:18-alpine

# SETTING THE WORKING DIRECTORY AS REQUIRED ( NOTE: Starting with nodeJS v-15  When no WORKDIR is specified, npm install is executed in the root directory of the container, which is resulting in this error. Executing the npm install in a project directory of the container specified by WORKDIR resolves the issue. )
WORKDIR /usr/app

# COPY REQUIRED SOURCE-CODE IN CONTAINER FS
COPY ./ ./

# INSTALL SOME DEPENDENCIES
RUN npm install

# DEFAULT START-UP COMMAND
CMD ["npm", "start"]
