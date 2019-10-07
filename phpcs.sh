#!/bin/sh
./vendor/bin/phpcs \
  --extensions=php \
  --ignore=crawler/CourseCache.php,crawler/dist/*,crawler/dist-includes/*,crawler/libraries/*,web/gen/*,web/libs/*,web/restricted/* \
  --standard=./phpcs.xml \
  web crawler
