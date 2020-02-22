# Deploying to the server

1. Commit changes and push to Git
2. SSH into the server
3. Run commands:

```sh
git pull # Get changes onto server
npm install # Install packages
cd web
yarn webpack # Builds newer Javascript
php tools/Build.php # Builds older Javascript
```
