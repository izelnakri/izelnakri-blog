rm -r dist
yarn install
bower install
ember build --environment production
pm2 start fastboot.js -i 0 PORT=5001 --name "opentickers.com" #fix fastboot port
