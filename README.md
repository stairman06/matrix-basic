# matrix-basic
Basic client for matrix.org, uses [matrix-types](https://github.com/stairman06/matrix-types).

## Local environment
This is setup as a yarn workspace, eventually more packages such as a `messaging` one may be added for uses with messaging clients.

Also, right now this does not depend directly on `matrix-types`. You need to use `yarn link` to get them to properly load:
```sh
git clone https://github.com/stairman06/matrix-types
cd matrix-types
yarn
yarn build
yarn link
```
then:
```sh
git clone https://github.com/stairman06/matrix-basic
cd matrix-basic
yarn
yarn link "matrix-types"
```