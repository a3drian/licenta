set HEROKU_APP_NAME=foodspy-api

:: Login to Heroku
:: heroku container:login

:: Build the application inside a container
docker build --tag %HEROKU_APP_NAME% -f Dockerfile ./

:: Push the application container to Heroku
:: heroku container:push -a %HEROKU_APP_NAME% web
docker tag %HEROKU_APP_NAME% registry.heroku.com/%HEROKU_APP_NAME%/web
docker push registry.heroku.com/%HEROKU_APP_NAME%/web

:: Release the application
heroku container:release -a %HEROKU_APP_NAME% web
