import os
import sys
import time
import glob
import subprocess
from playwright.sync_api import sync_playwright

VIDEO_DIR = "/tmp/playwright_video"
os.makedirs(VIDEO_DIR, exist_ok=True)
for f in glob.glob(f"{VIDEO_DIR}/*"):
    try:
        os.remove(f)
    except Exception:
        pass

print("🎬 Launching headless Chromium to record demo walkthrough...")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1280, "height": 720},
        record_video_dir=VIDEO_DIR,
        record_video_size={"width": 1280, "height": 720}
    )
    page = context.new_page()

    print("Navigating to http://localhost:5173...")
    page.goto("http://localhost:5173", wait_until="networkidle")
    time.sleep(3)

    print("Phase 1: Demonstrating Steady State Telemetry (4 seconds)...")
    time.sleep(4)

    print("Phase 2: Injecting Chaos Outage (Scenario A)...")
    inject_btn = page.locator('button:has-text("Inject Failure")')
    if inject_btn.count() > 0:
        inject_btn.first.click()
        print("Clicked 'Inject Failure'")
    else:
        print("Could not find Inject Failure button, calling API directly")
        page.evaluate("fetch('/api/simulator/inject', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({scenarioKey: 'payment_cascade', intensity: 1.0})})")

    print("Phase 3: Capturing latency spike & autonomous agents streaming (8 seconds)...")
    time.sleep(8)

    # Scroll down to show Agent feed
    page.mouse.wheel(0, 300)
    time.sleep(3)

    # Wait for Review & Execute Runbook button
    print("Phase 4: Opening Remediation Runbook Modal...")
    runbook_btn = page.locator('button:has-text("Review & Execute Runbook")')
    try:
        runbook_btn.wait_for(timeout=10000)
        runbook_btn.click()
        print("Clicked 'Review & Execute Runbook'")
    except Exception as e:
        print("Waiting for runbook button timed out, clicking first available runbook button if any:", e)

    time.sleep(2)

    # Check diff tab
    diff_tab = page.locator('button:has-text("Config Diff Preview")')
    if diff_tab.count() > 0:
        diff_tab.click()
        print("Clicked 'Config Diff Preview'")
        time.sleep(2)

    steps_tab = page.locator('button:has-text("Execution Commands")')
    if steps_tab.count() > 0:
        steps_tab.click()
        print("Switched back to 'Execution Commands'")
        time.sleep(1)

    # Approve & Execute Fix
    print("Phase 5: Approving & Executing Fix (Human-in-the-Loop)...")
    approve_btn = page.locator('button:has-text("Approve & Execute Fix")')
    if approve_btn.count() > 0:
        approve_btn.click()
        print("Clicked 'Approve & Execute Fix'")
    
    print("Watching automated execution & confetti celebration (6 seconds)...")
    time.sleep(6)

    # Close modal
    close_btn = page.locator('button:has-text("Close & Return to War-Room")')
    if close_btn.count() > 0:
        close_btn.click()
        print("Clicked 'Close & Return to War-Room'")
    else:
        # maybe close X
        page.keyboard.press("Escape")

    time.sleep(2)

    # Scroll back up
    page.mouse.wheel(0, -300)
    time.sleep(1)

    # Phase 6: Post-Mortem Modal
    print("Phase 6: Generating & Viewing Post-Mortem RCA...")
    postmortem_btn = page.locator('button:has-text("Post-Mortem")')
    if postmortem_btn.count() > 0:
        postmortem_btn.first.click()
        print("Opened Post-Mortem Modal")
        time.sleep(5)

    print("Demo recording interaction complete. Closing browser context...")
    context.close()
    browser.close()

# Find recorded webm
recorded_videos = glob.glob(f"{VIDEO_DIR}/*.webm")
if not recorded_videos:
    print("❌ No video file was generated in", VIDEO_DIR)
    sys.exit(1)

source_webm = recorded_videos[0]
target_mp4 = "/config/Desktop/BuildWithGemini/IncidentPulseAI/demo_recording.mp4"
target_gif = "/config/Desktop/BuildWithGemini/IncidentPulseAI/demo.gif"

print(f"Converting {source_webm} to {target_mp4} with ffmpeg...")
cmd = [
    "ffmpeg", "-y", "-i", source_webm,
    "-c:v", "libx264", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-preset", "medium", "-crf", "23",
    target_mp4
]
subprocess.run(cmd, check=True)
print(f"✅ Created {target_mp4} ({os.path.getsize(target_mp4)} bytes)")

print("Creating animated GIF preview for README...")
gif_cmd = [
    "ffmpeg", "-y", "-ss", "10", "-t", "12", "-i", target_mp4,
    "-vf", "fps=10,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
    target_gif
]
subprocess.run(gif_cmd, check=True)
print(f"✅ Created {target_gif} ({os.path.getsize(target_gif)} bytes)")
