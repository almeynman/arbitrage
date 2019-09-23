#!/bin/bash
create_send_exchange_pairs_queue() {
  aws --endpoint http://localhost:4576 sqs create-queue --queue-name send-exchange-pairs --region us-east-1
}

create_dispatch_with_common_symbols_queue() {
  aws --endpoint http://localhost:4576 sqs create-queue --queue-name dispatch-with-common-symbols --region us-east-1
}

create_assess_queue() {
  aws --endpoint http://localhost:4576 sqs create-queue --queue-name assess --region us-east-1
}

create_opportunity_table() {
  aws --endpoint-url=http://localhost:4569 dynamodb create-table --table-name opportunity  --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --region us-east-1
}

docker-compose up -d
sleep 10
create_send_exchange_pairs_queue
printf "%s" "created send exchanges pairs queue\n"
create_dispatch_with_common_symbols_queue
printf "%s" "created dispatch with common symbols queue\n"
create_assess_queue
printf "%s" "created assess queue\n"
create_opportunity_table
printf "%s" "created opportunity table\n"
