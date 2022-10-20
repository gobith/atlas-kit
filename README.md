# atlas-kit
Geo Atlas + SvelteKit


## docker commands

sudo chmod ugo+rw /var/run/docker.sock

docker-compose --profile dev down
docker-compose --profile dev up -d --build

docker-compose restart website.dev 

## Momorepo container

```sh
cd server
da/install-asdf-tool-versions
yarn

cd ../website
da/install-asdf-tool-versions
yarn
```
