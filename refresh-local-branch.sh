#!/bin/bash

set -e

git checkout master
git fetch origin
git pull origin

echo "Deleting local branch $1"
git branch -D $1 || true

echo "Deleting remote branch $1"
git push origin -d $1 || true

echo "Creating local branch $1 and pushing it up to origin"
git checkout -b $1
git push origin
