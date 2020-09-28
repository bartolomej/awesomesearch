# Server app

Here are a few options you may consider when deploying for production.

## 🚀 Deploy to Heroku

You can deploy your own instance of this server in a few minutes by following these steps:

1. **Click deploy to heroku button**

    Heroku will automatically setup deployment environment for you.

2. **Scale worker process to a single instance**

    Because this uses heroku's free plan, you need to manually scale up the 'worker' process via [heroku cli](https://github.com/heroku/cli).

   ```shell
   heroku ps:scale worker=1 --app <appname>
   ```

## 🚀 Deploy with Dokku PaaS

1. [**Setup ssh keys**](http://dokku.viewdocs.io/dokku/deployment/user-management/)
    
2. **Run setup script**
    
    ```bash
    # run this on the production server
   sudo sh setup-dokku.sh
   ```   
3. **Add deployment remote**

    ```shell
    # from your local machine
    # the remote username *must* be dokku or pushes will fail
    cd awesomesearch
    git remote add dokku dokku@<domain>:awesomesearch
    git push dokku master
    ```
## 🚀 Deploy with docker-compose and nginx

1. **install and setup nginx**

    ```bash
   sudo apt install nginx
   
   # create dafault configuration file
   sudo nano /etc/nginx/sites-available/default 
   ```
   
   Example configuration file contents:
   ```
   server_name yourdomain.com www.yourdomain.com;
   
   location / {
       proxy_pass http://localhost:8000; # web process runs on port 8000 in production
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
   }
   ```
   
   Then validate config file and restart nginx service:
   ```bash
   # Check NGINX config
   sudo nginx -t
   
   # Restart NGINX
   sudo service nginx restart
   ```
   
 2. **run app with docker-compose** 
 
    Firstly you need to [install docker-compose](https://docs.docker.com/compose/install/).
    
    Then run this app for production with:
    ```bash
    docker-compose -f docker-compose.prod.yml up -d
    ```
 
    Take a look at [this](https://docs.docker.com/compose/production/) more in depth guide from docker on how to configure operate production environment.
 
 
 3. **setup domain name and ssl**
 
    ```bash
    sudo add-apt-repository ppa:certbot/certbot
    sudo apt-get update
    sudo apt-get install python-certbot-nginx
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    
    # Only valid for 90 days, test the renewal process with
    certbot renew --dry-run
    ```
