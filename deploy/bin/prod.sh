#!/bin/bash  
echo "============= Starting Production Environment ============="  

docker-compose -f docker-compose-prod.yml up -d --build
