include .env

deploy-stage:
	ssh ${STAGE_USER}@${STAGE_HOST} -p ${STAGE_PORT} 'cd ${STAGE_PATH} && git pull && docker-compose down --remove-orphans && docker-compose build && docker-compose up -d'

deploy-prod:
	ssh ${PROD_USER}@${PROD_HOST} -p ${PROD_PORT} 'cd ${PROD_PATH} && git pull && docker-compose --remove-orphans && docker-compose build && docker-compose up -d'
