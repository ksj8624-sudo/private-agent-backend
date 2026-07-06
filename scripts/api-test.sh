#!/bin/bash

echo "===== Ping ====="
curl http://localhost:3000/api/ping

echo
echo "===== Ask ====="
curl -X POST http://localhost:3000/api/ask \
-H "Content-Type: application/json" \
-d '{"question":"Hello"}'

echo
echo "===== Plan ====="
curl -X POST http://localhost:3000/api/plan \
-H "Content-Type: application/json" \
-d '{"topic":"AI Agent"}'

echo
echo "===== Review ====="
curl -X POST http://localhost:3000/api/review \
-H "Content-Type: application/json" \
-d '{"reviewCode":"const a=1;"}'

echo
echo "===== Done ====="