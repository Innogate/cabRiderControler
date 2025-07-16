if [ ! -d "./node_modules" ]; then
  npm install
fi
#check PRODUCTION=true
if [ "$PRODUCTION" = true ]; then
   git fetch --all && git pull
fi
npm run dev
