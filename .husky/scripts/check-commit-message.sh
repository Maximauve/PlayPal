#!/bin/bash

MESSAGE=$(cat $1) 
COMMITFORMAT="^(feat|fix|docs|style|refactor|test|chore|perf|other)(\((.*)\))?: (.*)( \(#([0-9]+)\))?$"

if ! [[ "$MESSAGE" =~ $COMMITFORMAT ]]; then
  echo "Your commit was rejected due to the commit message. Skipping..." 
  echo ""
  echo "Please use the following format:"
  echo "feat: feature example comment (#4321)"
  echo "fix(ui): bugfix example comment (#4321)"
  echo "doc: added documentation"
  echo "doc(install): added installation instructions"
  echo ""
  echo "More details on docs/COMMITS.md"
  exit 1
fi
