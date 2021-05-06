npm uninstall deco-api
npm install deco-api

# if [ -z "$(git status --porcelain)" ]; then 
#   # Working directory clean
#   echo "Repository 'deco-three' clean";
# else 
#   # Uncommitted changes
#   echo "Repository 'deco-three' has uncommited files. Please, commit before to run this script";
#   exit 0;
# fi

# echo "Moving directory to 'deco-api'"
# cd ../deco-api

# if [ -z "$(git status --porcelain)" ]; then 
#   # Working directory clean
#   echo "Repository 'deco-api' clean";
# else 
#   # Uncommitted changes
#   echo "Repository 'deco-api' has uncommited files. Please, commit before to run this script";
#   exit 0;
# fi

# # READ LAST COMMIT HASH
# read -r hash<.git/refs/heads/master
# echo "Latest 'deco-api' git hash: '$hash'"
# echo "Moving directory to 'deco-three'"
# cd ../deco-three
# echo "Updating package.json with latest git hash of 'deco-api'"
# search='("deco-api": ")(.*)#([a-z0-9]*)(")'
# replace="\1\2#${hash}\4"
# if [[ "$OSTYPE" == "darwin"* ]]; then
#   sed -i "" -E "s/${search}/${replace}/g" "package.json"
# else
#   sed -i -E "s/${search}/${replace}/g" "package.json"
# fi
# sleep 1
# echo "Remove ref to 'deco-api' in 'package-lock.json'"
# echo "`jq 'del(.dependencies."deco-api")' package-lock.json`" > package-lock.json
# echo "Remove 'deco-api' in node_mdules"
# rm -rf node_modules/deco-api
# echo "npm install"
# npm install
# git add package.json package-lock.json
# git commit -m "Install last deco-api"
# git push origin