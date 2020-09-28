# create dokku application
dokku apps:create awesomesearch &&

# install required services
sudo dokku plugin:install https://github.com/dokku/dokku-mysql.git mysql &&
sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis &&

# create service instances
dokku mysql:create mysqldb &&
dokku redis:create redisdb &&

# link services to our app
dokku mysql:link mysqldb awesomesearch --alias "DB_URL" &&
dokku redis:link redisdb awesomesearch --alias "REDIS_URL" &&
