#!/bin/bash
cd frontend || exit 1
npm ci
npm run build
