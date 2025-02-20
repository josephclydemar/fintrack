PHP_ARTISAN=php artisan
DEVELOPMENT=development
PRODUCTION=production

# * ***************** DEVELOPMENT rules ***************** *
dev: serve_dev queue_work_dev

prod: serve_prod queue_work_prod


# deployment
serve_dev:
	trap "kill 0" SIGINT; $(PHP_ARTISAN) serve --env=$(DEVELOPMENT)

# queue
queue_work_dev:
	trap "kill 0" SIGINT; $(PHP_ARTISAN) queue:work -v --env=$(DEVELOPMENT)

# migration
migrate_dev:
	$(PHP_ARTISAN) migrate --env=$(DEVELOPMENT)

migrate_fresh_dev:
	$(PHP_ARTISAN) migrate:fresh --env=$(DEVELOPMENT)

# database
db_show_dev:
	$(PHP_ARTISAN) db:show --env=$(DEVELOPMENT)

db_wipe_dev:
	$(PHP_ARTISAN) db:wipe --env=$(DEVELOPMENT)



# * ***************** PRODUCTION rules ***************** *
# deployment
serve_prod:
	$(PHP_ARTISAN) serve --env=$(PRODUCTION)

# queue
queue_work_prod:
	$(PHP_ARTISAN) queue:work -v --env=$(PRODUCTION)

# migration
migrate_prod:
	$(PHP_ARTISAN) migrate --env=$(PRODUCTION)

migrate_fresh_prod:
	$(PHP_ARTISAN) migrate:fresh --env=$(PRODUCTION)

# database
db_show_prod:
	$(PHP_ARTISAN) db:show --env=$(PRODUCTION)

db_wipe_prod:
	$(PHP_ARTISAN) db:wipe --env=$(PRODUCTION)
