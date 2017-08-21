build:
	./node_modules/gatsby/bin/gatsby.js build
	cd public && git add . && git commit -m "new post"
	cd public && git push origin master
	cd public && netlify deploy
