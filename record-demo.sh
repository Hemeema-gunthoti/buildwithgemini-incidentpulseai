#!/usr/bin/env bash
# ==============================================================================
# IncidentPulse AI — Screen Recording & Demo Capture Helper
# ==============================================================================
set -euo pipefail

OUTPUT_FILE="${1:-demo_recording.mp4}"
DURATION="${2:-120}" # Default to 120 seconds (2 minutes)
DISPLAY_NUM="${DISPLAY:-:1}"

echo "=================================================="
echo "🎬 IncidentPulse AI Demo Video Recorder"
echo "=================================================="
echo "Target Output : ${OUTPUT_FILE}"
echo "Duration      : ${DURATION} seconds (2 minutes)"
echo "Display       : ${DISPLAY_NUM}"
echo "Resolution    : 1920x1080 (60 fps)"
echo "=================================================="
echo "Recording starts in 3 seconds. Switch to your browser window!"
echo "Press Ctrl+C at any time to stop recording early."
echo ""
sleep 3

ffmpeg -y -f x11grab -draw_mouse 1 -video_size 1920x1080 -framerate 30 -i "${DISPLAY_NUM}" \
  -t "${DURATION}" -c:v libx264 -preset ultrafast -pix_fmt yuv420p "${OUTPUT_FILE}"

echo ""
echo "✅ Demo video recorded successfully to: ${OUTPUT_FILE}"
echo "File size: $(du -h "${OUTPUT_FILE}" | cut -f1)"
