# DOCKERFILE FOR IMAGE THAT WILL RUN REDIS-SERVER ::

# 1. USE AN EXISTING DOCKER IMAGE AS A BASE
FROM alpine

# 2. DOWNLOAD AND INSTALL DEPENDENCIES
RUN apk add --update redis
RUN apk add --update gcc 

# 3. TELL THE IMAGE WHAT TO DO WHEN IT STARTS AS A CONTAINER (START-UP COMMAND)
CMD ["redis-server"]

