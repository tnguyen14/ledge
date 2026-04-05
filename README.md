# ledge

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

### Local development

```sh
npm start
```

#### Using Github Codespaces

```sh
gh cs ports forward 13050:13050 4003:4003
gh cs ssh
```

#### Authenticating with API server

Log into the app, and copy the JWT token. Set it with

```sh
export JWT_TOKEN=<>
```

### Metadata lookup

```sh
./bin/get_metadata.sh
./bin/get_metadata.sh --category
```

### Transaction lookup

To find a transaction locally by merchant

```sh
export env=dev # or env=prod
./bin/find_transactions.js -m "merchant name"

# number of results
./bin/find_transactions.js --category "dineout" | jq 'length'
```

### Update transaction with lookup

```sh
./bin/find_transactions.js --category "gas" --limit 5 \
  | jq -r '.[].id' \
  | xargs -I{} ./bin/update_transaction.js {} --category transportation
```

### Bad merchant data problems

#### Merchant with variant names

```sh
# find them with
./bin/find_merchant_name_variants.sh
```

#### Same merchant, multiple slugs

```sh
./bin/find_duplicate_merchant_slugs.sh
```
