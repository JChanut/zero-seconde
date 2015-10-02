#!/bin/bash

wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.27.1/install.sh | bash

echo "source /home/vagrant/.nvm/nvm.sh" >> /home/vagrant/.profile
source /home/vagrant/.profile

nvm install 0.12
nvm alias default 0.12