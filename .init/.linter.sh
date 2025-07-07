#!/bin/bash
cd /home/kavia/workspace/code-generation/attendtrack-110575-4d5af8ed/attendance_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

