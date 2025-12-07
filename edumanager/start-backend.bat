@echo off
cd /d E:\AndroidExploration\Java\edumanager
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2
pause

