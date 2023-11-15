while getopts t:a: flag
do
    case "${flag}" in
        t) token=${OPTARG};;
        a) alias=${OPTARG};;
    esac
done
# save stdout and stderr to files


vercel deploy --prod --prebuilt --token=$token >deployment-url.txt 2>error.txt
 
# check the exit code
code=$?
if [ $code -eq 0 ]; then
    # Now you can use the deployment url from stdout for the next step of your workflow
    deploymentUrl=`cat deployment-url.txt`
    vercel alias set $deploymentUrl $alias --token=$token --scope=coursetable
else
    # Handle the error
    errorMessage=`cat error.txt`
    echo "There was an error: $errorMessage"
fi