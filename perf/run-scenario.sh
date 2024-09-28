#!/bin/sh
npm run artillery -- run tests/$1.yaml -e $2
