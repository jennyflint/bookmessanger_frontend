# Troubleshooting

## Editing Permissions on Linux

If you work on Linux and cannot edit some of the project files right after
the first installation, you can run the following command
to set yourself as owner of the project files that were created by the Docker container:


```console
sudo chown -R $USER:$USER /var/www/bookmessanger_frontend
```