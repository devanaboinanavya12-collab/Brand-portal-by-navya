import subprocess
import time
import sys

def run_tunnel():
    print("Starting localtunnel connection to port 5001 with subdomain 'cerevyn-brandportal'...")
    while True:
        try:
            # Start py-localtunnel
            process = subprocess.Popen(
                [sys.executable, "-m", "py_localtunnel.cli", "port", "5001", "-s", "cerevyn-brand-portal"],

                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True
            )
            print(f"Tunnel process started with PID {process.pid}")
            
            # Read stdout line by line
            while True:
                line = process.stdout.readline()
                if not line:
                    break
                print(f"[localtunnel] {line.strip()}", flush=True)
                
                # Check for errors in output that indicate a crash/disconnection
                if "Error=" in line or "Broken pipe" in line or "ConnectionError" in line:
                    print("Error detected in tunnel output, terminating process...", flush=True)
                    process.terminate()
                    break
            
            # Wait for process to exit
            exit_code = process.wait()
            print(f"Tunnel process exited with code {exit_code}. Restarting in 5 seconds...", flush=True)
        except Exception as e:
            print(f"Exception in tunnel runner: {e}. Restarting in 5 seconds...", flush=True)
            
        time.sleep(5)

if __name__ == "__main__":
    run_tunnel()
