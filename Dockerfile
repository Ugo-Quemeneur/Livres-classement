# Utilisez une image légère basée sur un serveur web pour servir l'application front-end
FROM nginx:alpine
# Copiez les fichiers de l'application dans le répertoire de travail de l'image nginx
COPY . /usr/share/nginx/html
# Le serveur web nginx écoute le port 80 par défaut, donc pas besoin de spécifier EXPOSE
# CMD n'est généralement pas nécessaire pour une image web statique, car le serveur nginx est déjà démarré par défaut
# Si vous souhaitez ajouter un CMD personnalisé, il démarrera automatiquement après le démarrage du serveur nginx
# Par exemple : CMD ["nginx", "-g", "daemon off;"]