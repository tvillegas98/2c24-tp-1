.PHONY: up down stop upd

upd:
	docker-compose up -d

up:
	docker-compose up
stop:
	docker-compose stop

down:
	docker-compose down
