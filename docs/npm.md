### Install package inside docker from terminal

```bash
docker exec -it bookmessanger_frontend npm install -D <package-name>
```

### Run linter and auto fix errors

```bash
docker exec -it bookmessanger_frontend npm run lint-fix
```

### Run Type Check

```bash
docker exec -it bookmessanger_frontend npm run typecheck
```