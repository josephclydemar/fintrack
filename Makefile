BUILD_UI = cd fintrack-ui && npm run build
CLEAN_UI = cd fintrack-ui && rm -rf dist

all:
	$(BUILD_UI)
	mv fintrack-ui/dist/assets fintrack-api/public/.
	mv fintrack-ui/dist/*.svg fintrack-api/public/.
	mv fintrack-ui/dist/index.html fintrack-api/resources/views/home.blade.php

clean:
	$(CLEAN_UI)
	rm -rf fintrack-api/public/assets
	rm fintrack-api/public/*.svg
	rm fintrack-api/resources/views/home.blade.php
