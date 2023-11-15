is_prod=true

while getopts t:a:b:d flag
do
    case "${flag}" in
        t) token=${OPTARG};;
        a) alias=${OPTARG};;
        b) second_alias=${OPTARG};;
        d) is_prod=false;;
    esac
done
# save stdout and stderr to files

if [[ $is_prod == true ]]; then
  echo "Deploying to production"
  vercel deploy --prod --prebuilt --token=$token >deployment-url.txt 2>error.txt
else
  echo "Deploying to development"
  vercel deploy --prebuilt --token=$token >deployment-url.txt 2>error.txt
fi
 
# check the exit code
code=$?
if [ $code -eq 0 ]; then
    # Now you can use the deployment url from stdout for the next step of your workflow
    deploymentUrl=`cat deployment-url.txt`
    vercel alias set $deploymentUrl $alias --token=$token --scope=coursetable
    if [[ -n $second_alias ]]; then
      vercel alias set $deploymentUrl $second_alias --token=$token --scope=coursetable
    fi
else
    # Handle the error
    errorMessage=`cat error.txt`
    echo "There was an error: $errorMessage"
fi