#!/bin/bash

apt-get update

export DEBIAN_FRONTEND=noninteractive
apt-get install -y mysql-server

 mysql -u root < /vagrant/sql/zero_sec.sql