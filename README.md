# portfolio-cli

## Take home test I did for [Propine DEFI](https://propine.com/)

## This is a command line program that can analyze a portfolio in csv format:

### How to use

You can utilize the program as follows like so:

1. - Clone the repo:

```bash
    git clone https://github.com/Jude-X/portfolio-cli
```

2. - Paste the portfolio csv in the root directory:

The CSV file has the following columns in the exact order

- timestamp: Integer number of seconds since the Epoch
- transaction_type: Either a DEPOSIT or a WITHDRAWAL
- token: The token symbol
- amount: The amount transacted

3. - Compile the src code:

```
    npm run build
```

4. - The following commands

To view menu -

```
    node ./lib/index.js -h
```

To set cryptocompare key -

```
    node ./lib/index.js key set
```

then enter your api key

To display your cryptocompare key -

```
    node ./lib/index.js key show
```

To set your csv portfolio file, Please ensure csv is in the correct format as above -

```
    node ./lib/index.js file set
```

To view the file currently set -

```
    node ./lib/index.js file show
```

To analyze the file set -
The command below is the default command and gives the general per token portfolio in USD

```
    node ./lib/index.js analyze run
```

To analyze the file set for a particular token -

```
    node ./lib/index.js analyze token
```

To analyze the file set for a particular date (ensure date is in dd/mm/yyyy format) -

```
    node ./lib/index.js analyze date
```

To analyze the file set for a particular date and a particular token -

```
    node ./lib/index.js analyze date-token
```
