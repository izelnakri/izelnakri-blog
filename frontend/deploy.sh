yarn install
bower install
rm -r dist
ember build --environment production
pm2 start fastboot.js -i 0 --name "izelnakri.com" -x -- PORT=5005 #fix fastboot port
