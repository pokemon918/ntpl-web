## Environment Requirements:

1. PHP v7+ (with mbstring and php-dom extensions)
2. MySql 5.7
3. PHP Composer
4. Node LTS, npm, Yarn, fkill
5. Git, Git Flow
6. curl

============================================

## Steps To Start API server:

1. Install all requirements from list above;
2. Run `git flow init` command. Set up master as prod and develop as development branches other options set to default;
3. Configure database credentials in `.env` file
4. Run `yarn install`
5. Run `yarn init` or `npm run init`
6. Run `yarn start` or `npm run start`
7. Check the output:

Following line should have response code 200
`[Wed May  8 16:54:27 2019] 127.0.0.1:1061 [200]: /tastingnote/testkey1`

At the end of output should be following json object:
`{"status":"success","note_key":"testkey1","lang":[{"lang_key":"testlangkey3","val":"l18nval3"},{"lang_key":"molestiae789...`

8. Open http://localhost:8000 in your browser 

## Useful API package.json Scripts:

`start` - start API server locally on port 8000 and run testkey1

`stop` - stop API server process

`init` - shortcut to run seed and setup commands

`setup` - run composer install command 

`seed` - run database seeds 

============================================

## Steps To Start WEB development:

1. Start API server using tutorial above 
2. Run `git flow init` command. Set up master as prod and develop as development branches other options set to default;
3. Run `yarn install`
4. Run `yarn start` or `npm run start`

## Useful Package.json Scripts:**

`start` - configure app, start local server and open browser on login/registration page of the app
`serve` - start local server on port 3000 on build
`build` - build the app
`storybook` - start storybook on 6006 port

## Guidelines
[Frontend Development Guidelines](GUIDELINES.md)