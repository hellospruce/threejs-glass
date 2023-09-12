#!/usr/bin/sh
npm run build
export AWS_PROFILE=spruce

aws s3 cp dist/dist.js s3://spruce-cdn/sohn-threejs-glass/dist.js --acl public-read
