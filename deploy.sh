#!/bin/bash
tar --exclude='node_modules' --exclude='build' --exclude='uploads'--exclude='src/static' -cvf wetube.tar ./
scp -i /Users/autumn/.ssh/aws_ec2_t2micro.pem wetube.tar ec2-user@15.164.45.155:~
rm wetube.tar

ssh -i /Users/autumn/.ssh/aws_ec2_t2micro.pem ec2-user@15.164.45.155 << 'ENDSSH'
pm2 stop wetube
rm -rf wetube
mkdir wetube
tar -xvf wetube.tar -C wetube
rm wetube.tar
cd wetube
npm install
npm start
ENDSSH