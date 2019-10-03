Development and testing is done via docker, the requisite files are not included but are rather detailed here.

## Setting up your docker environment

1. Clone this repo and `cd` into its directory.
2. Create `Dockerfile` with the following contents:

```
FROM wordpress:latest
RUN apt update && apt install -y \
    nodejs \
    npm
```

3. Create `docker-compose.yml` with the following contents:

```
version: '3.1'

services:

  wordpress:
    build: .
    restart: always
    ports:
      - 8080:80
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: exampleuser
      WORDPRESS_DB_PASSWORD: examplepass
      WORDPRESS_DB_NAME: exampledb
    volumes:
      - wordpress:/var/www/html
      - ./:/var/www/html/wp-content/plugins/redcap-stats-plugin

  db:
    image: mysql:5.7
    restart: always
    environment:
      MYSQL_DATABASE: exampledb
      MYSQL_USER: exampleuser
      MYSQL_PASSWORD: examplepass
      MYSQL_RANDOM_ROOT_PASSWORD: '1'
    volumes:
      - db:/var/lib/mysql

volumes:
  wordpress:
  db:
```

4. Run `docker-compose up -d`
5. Navigate your web browser to `localhost:8080`
6. Configure your site using easy to remember credentials
7. Navigate to the **Plugins** tab on the left sidebar
8. Activate `redcap-stats-plugin`

## Creating test pages for the plugin

This section assumes you are new to WordPress.

1. Navigate to the **Pages** tab on the left sidebar
2. Select **Add New**
3. Hover your mouse over the **Start writing or type / to choose a block**
4. Activate the plugin via the shield icon that will appear to the right of the text

## Configuring the plugin

After activating the plugin block, select the **Block** tab in the right sidebar and enter an appropriate URL in the _API endpoint_ field, e.g. `https://redcap.ctsi.ufl.edu/redcap/api/?type=module&prefix=redcap_webservices&page=plugins%2Fendpoint&NOAUTH&query_id=system_stats`. Click _Save Draft_ in the top right corner of the page, then click preview.

The preview page is where you should check for desired appearance.

## Updating this plugin

1. "ssh" into the WordPress docker container
    - Run `docker ps` and note the first few characters of the wordpress image's `CONTAINER ID`
    - Run `docker exec -ti $your_container_id bash`
2. While in the docker container, `cd` to `/var/www/html/wp-content/plugins/redcap-stats-plugin/`
3. Run `npm start`

The plugin is now in develop mode and can be changed on your host machine.

Development should be done only in the `src/` directory.  
Note that for unknown reasons (perhaps the async nature of javascript?), after making changes you occasionally must delete the block from your test page, save the test page, navigate away from editing the page, return to it, and re-add the block to see changes.

Upon completion of your changes, in your docker container, in the `/var/www/html/wp-content/plugins/redcap-stats-plugin/` directory, run `npm run build` to compile a production version of the plugin. `git add` the contents of the `dist` and `src` directories and use these for your commit.
