FROM nginx:alpine

# Copy static files
COPY static/ /usr/share/nginx/html/static/
COPY templates/index.html /usr/share/nginx/html/index.html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
