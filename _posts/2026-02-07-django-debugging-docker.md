---
layout: default
title: "Debugging Django in Docker"
tags: [Django, Python, Docker]
---

# Debugging Django app in docker container with VS Code

Debugging inside a container is bit more involved than running Django directly
in the terminal. The following instructions should be enough as a starting
point.

## Dockerfile

```

########## DEBUG IMAGE ##########

FROM base-runtime-image AS debug

# Install debugpy
# We don't need to cache packages
RUN pip install --no-cache-dir debugpy

EXPOSE 5678
# Command for runserver but also 
CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", "manage.py", "runserver", "0.0.0.0:8000"]

```

This is an extra section to add to the dockerfile that can be targeted when
building the image:

```
docker buildx build --target debug -t myapp:debug
```

## Compose file

```

services:
  db:
    image: mysql:latest
    hostname: mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: mydb
    volumes:
      - mysql:/var/lib/mysql
    networks:
      - myapp
  app:
    image: myapp:debug
    volumes:
      - .:/code
    ports:
      - "8080:8000"
      - "5678:5678"
    env_file:
      - .env
    depends_on:
      - db
    networks:
      - myapp

volumes:
  mysql:

networks:
  myapp:
    driver: bridge

```

This is simplified and general, the important parts to note is the additional
port for debugpy (5678) and then run it using the following:

```
docker compose -f "compose.debug.py" up -d --force-recreate

```

## VS Code setup


```

"launch": {
		"version": "0.2.0",
		"configurations": [
			{
				"name": "Python: Django (docker)",
				"type": "debugpy",
				"request": "attach",
				"connect": {
					"host": "localhost",
					"port": 5678,
				},
				"pathMappings": [
					{
						"localRoot": "${workspaceFolder}",
						"remoteRoot": "."
					}
				],
				"django": true,
				"justMyCode": true
			}
        ]
    }

```

`localRoot` might need updating if the folder that is used in the docker
container is a subfolder rathther than the root folder of the workspace.

Once you have this in place then you can the debugger as you normally would.
