# FROM node:9.3.0-alpine
# LABEL author="Izel Nakri"
#
# ENTRYPOINT node main.js
#
# # --------------- BUILD CONTAINER ---------------
# # these commands will be executed with the root
# # of this project (../) as it's working directory
# COPY dist dist/
# COPY main.js main.js
# # these dependancies are needed for running the app
# # (note that the project is already build, so we don't run the package.json file
# # to keep the image small
# RUN npm install express
# # Remove unesserary package-lock.json
# RUN rm -f package-lock.json
