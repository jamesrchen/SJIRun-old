echo "Running dev script - this should not be run in production"

npm run --prefix server/ dev &
npm run --prefix client/ dev 