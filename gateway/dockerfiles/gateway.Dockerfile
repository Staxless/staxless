FROM devopsfaith/krakend:watch as dev
COPY ["krakend.yml", "/etc/krakend/krakend.yml"]
EXPOSE 8080
CMD [ "run", "-dc", "krakend.yml"]

FROM devopsfaith/krakend:latest as prod
COPY ["krakend.yml", "/etc/krakend/krakend.yml"]
EXPOSE 8080
CMD [ "run", "-dc", "krakend.yml"]
