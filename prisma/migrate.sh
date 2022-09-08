#!bin/bash

rm -rf prisma/migrations
rm -rf prisma/dev.db
rm -rf prisma/dev.db-journal

npx prisma migrate dev --name init
