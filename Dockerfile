# Utilisez une image Node.js comme base
FROM node:18-alpine AS build

# Définissez le répertoire de travail
WORKDIR /app

# Copiez les fichiers nécessaires
COPY package.json package-lock.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers
COPY . .

# Construisez l'application
RUN npm run build

# Étape de production pour servir l'application avec nginx
FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copiez le fichier de configuration nginx personnalisé si nécessaire
# COPY nginx.conf /etc/nginx/nginx.conf

# Exposez le port 80
EXPOSE 80

# Commande pour lancer nginx
CMD ["nginx", "-g", "daemon off;"]
