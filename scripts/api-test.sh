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
echo "===== Review History ====="
curl -s "http://localhost:3000/reviewHistory?limit=5" | jq
echo
echo "===== Done ====="

echo
echo "===== Agent History ====="
curl -s "http://localhost:3000/dev/agent/history?limit=5" | jq
echo
echo "===== Done ====="