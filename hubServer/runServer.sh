#!/bin/bash
rfkill unblock bluetooth
rm -rf .devices
rm -rf .peers
node hubServer.js
