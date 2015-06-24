printer(){
  printf '\n' && printf '=%.0s' {1..40} && printf '\n'
  echo $1
  printf '=%.0s' {1..40} && printf '\n'
}

print "Grabbing latest source ..."
git pull origin master

printer "Deploying mapi web app ..."

printer "Installing node modules ..."
npm install

printer "Running gulp tasks ..."
gulp

printer "Restarting server ..."
supervisorctl restart mapi