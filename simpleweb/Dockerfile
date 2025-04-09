# BASE IMAGE
FROM node:18-alpine

# SETTING THE WORKING DIRECTORY AS REQUIRED ( NOTE: Starting with nodeJS v-15  When no WORKDIR is specified, npm install is executed in the root directory of the container, which is resulting in this error. Executing the npm install in a directory of the container specified by WORKDIR resolves the issue. )
WORKDIR /usr/app

# COPY PACKAGE.JSON IN THE CONTAINER FS FOR INSTALLING DEPENDENCY
COPY ./package.json ./

# INSTALL DEPENDENCIES
RUN npm install

# COPY REQUIRED SOURCE-CODE IN CONTAINER FS
COPY ./ ./

# DEFAULT START-UP COMMAND
CMD ["npm", "start"]
