# How to use it

## Clone it by some means to the VPS.
Lets put it in `/home/myname/sitename`

## Set the VPS' version of the repo with the appropriate flags
`receive.denycurrentbranch=updateInstead` allows you to push from your local repo to the server directly.

## Set the virtual env
`python3 -m venv .venv`
`source .venv/bin/activate`
`python3 -m pip install .`
The `-e` is necessary so that live updates will automagically be reloaded on the server.
This way, whenever you push to the VPS, it automatically updates the package.
`python3 -m pip install uvicorn`

## NGINX setup
`touch /etc/nginx/sites-available/sitename`
Write the actual config
```nginx
server {
    listen 80;
    server_name sitename.tld

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/myname/sitename/site.sock;
    }
}
```
## Activate the nginx service
`sudo ln -s /etc/nginx/sites-available/sitename /etc/nginx/sites-enabled/`
`sudo systemctl restart nginx`


## Certbot
`sudo certbot --nginx -d sitename.tld`
This will automatically setup the https for the service.

## create systemd service
In `/etc/systemd/system` create a new file

sitename.service
```systemd
[Unit]
Description=Starts the service
After=network.target

[Service]
User=myname
Group=www-data
WorkingDirectory=/home/myname/sitename
Environment="Path=/home/myname/sitename/.venv/bin"
ExecStart=/home/myname/sitename/.venv/bin/gunicorn --workers 3 --bind unix:/home/myname/sitename/sitename.sock -m 007 src.wsgi:app

[Install]
WantedBy=multi-user.target
```

## Auto restart systemd with git hooks
edit `/myname/sitename/.git/hooks/post-update` and add the following lines:
```git-hook
cd /home/myname/sitename
source .venv/bin/activate
pip install --no-cache-dir
sudo systemctl restart sitename
```

## Start it!
`sudo systemctl enable sitename`
`sudo systemctl start sitename`