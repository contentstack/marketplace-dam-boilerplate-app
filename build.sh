# build command format is
# bash build.sh <uiUrl>
# example commands:
# bash build.sh <dev-uiUrl>
# bash build.sh <stag-uiUrl>
# bash build.sh <uiUrl>


set -e
#The above command is to fail build if any one of the below build steps fail

#UI Build
cd ui
updateUIConfigFile() {
	if [ "$1" == "" ]
		then
			echo "Missing UI URL input parameter"
			exit $1
	fi
	rm -rf .newEnv
	sed '/^REACT_APP_UI_URL/d' .env > .newEnv
	echo -e "\nREACT_APP_UI_URL=$1" >> .newEnv
	rm -rf .env
	mv .newEnv .env
}
rm -rf build
rm -rf node_modules
updateUIConfigFile $1
npm install
npm run precommit
npm run build

#RTE Build
cd rte
updateRTEConfigFile() {
	if [ "$1" == "" ]
		then
			echo "Missing UI URL input parameter in RTE"
			exit $1
	fi
	rm -rf .newEnv
	sed '/^REACT_APP_UI_URL/d' .env > .newEnv
	echo "REACT_APP_UI_URL=$1" >> .newEnv
	rm -rf .env
	mv .newEnv .env
}
updateRTEConfigFile $1
npm install
npm run build
cd ../..
