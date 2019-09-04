bundle install

## Deployment Steps

1. Ensure the site is working locally with all your changes made
2. Ensure all images are optimised before continuing
2. Run the command `JEKYLL_ENV=production bundle exec jekyll build --config _config.yml,_config_production.yml`
3. Commit newly generated files
4. Push to git
5. Deploy via Buddy live deployment script

