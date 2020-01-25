try-dev: 
	npm i && npm run dev

try:
	npm i && npm run build

start:
	npm run dev

prod:
	npm run build

lint: 
	npx eslint .

lint-fix: 
	npx eslint . --fix