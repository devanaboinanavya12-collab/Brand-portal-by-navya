#!/bin/bash
cd "/Users/a9553370471/Desktop/CEREVYN-1"

echo "=== Starting CEREVYN Brand Portal ==="

# 1. Stop any existing server running on port 5001
PID_SERVER=$(lsof -t -i :5001)
if [ ! -z "$PID_SERVER" ]; then
  echo "Stopping existing server on port 5001 (PID: $PID_SERVER)..."
  kill -9 $PID_SERVER
fi

# 2. Stop any existing localtunnel/run_tunnel processes
PID_RUNNER=$(pgrep -f "run_tunnel.py")
if [ ! -z "$PID_RUNNER" ]; then
  echo "Stopping existing tunnel runner (PID: $PID_RUNNER)..."
  kill -9 $PID_RUNNER
fi

PID_TUNNEL=$(pgrep -f "py_localtunnel")
if [ ! -z "$PID_TUNNEL" ]; then
  echo "Stopping existing localtunnel (PID: $PID_TUNNEL)..."
  kill -9 $PID_TUNNEL
fi

# 3. Start the FastAPI server in the background
echo "Starting FastAPI server..."
nohup /Library/Frameworks/Python.framework/Versions/3.12/bin/python3 server.py >> server_daemon.log 2>&1 &

# Wait a brief moment for the server to spin up
sleep 2

# 4. Start the python tunnel runner daemon in the background
echo "Starting localtunnel auto-reconnect runner..."
nohup /Library/Frameworks/Python.framework/Versions/3.12/bin/python3 run_tunnel.py >> tunnel_daemon.log 2>&1 &

echo "=== Startup Complete ==="
echo "Local server: http://localhost:5001"
echo "Public URL:   https://cerevyn-brand-portal.loca.lt"
echo "Logs saved in: server_daemon.log and tunnel_daemon.log"

