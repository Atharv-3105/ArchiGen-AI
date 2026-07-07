FROM node:20-alpine 

WORKDIR  /app 

COPY package*.json ./ 
RUN npm ci 

COPY . . 

#Expose the Vite default PORT
EXPOSE 3000

#Run server and bind all the network interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

