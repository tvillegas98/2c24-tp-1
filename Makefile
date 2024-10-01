.PHONY: up down stop upd up_and_build

upd:
	docker-compose up -d

up:
	docker-compose up
stop:
	docker-compose stop

down:
	docker-compose down

up_and_build:
	docker-compose up --build
