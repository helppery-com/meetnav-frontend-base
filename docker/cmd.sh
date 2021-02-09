echo "Running cicd"
cd /github/meetnav-frontend-base/cicd && node server.js &
echo "Running app"
cd /github/meetnav-frontend-base/quasar && npx quasar dev