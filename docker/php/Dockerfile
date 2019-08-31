FROM php:fpm-alpine
RUN docker-php-ext-install mysqli
COPY wait-for /wait-for
RUN chmod +x /wait-for
