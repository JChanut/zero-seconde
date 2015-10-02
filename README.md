Zero-seconde
========

Zero-seconce Web App 

Presentation
-----------

Zero-seconde is a Single Page Web Application.

Technologies
------------
The WebApp use several technologies:

TODO

Prerequisite
-------------
Before you install and launch the app, you need some prerequisite:

* Vagrant (Configure reproducible and portable work environments)
* VirtualBox (Virtualization)
* NodeJS

You can now install Vagrant and VirtualBox, the installers can be downloaded on their websites:

* Vagrant: https://www.vagrantup.com/
* VirtualBox: https://www.virtualbox.org/

Once vagrant and VirtualBox are intalled on your development machine, you need to install the vagrant-proxyconf plugin with the following command-line:

```
vagrant plugin install vagrant-proxyconf
```

Installation
------------

Once you have all the prerequisite, get the source code with Git cloning:

```
git clone https://github.com/JChanut/zero-seconde
```

Get into source code app directory and start by installing all local dependencies:

```
cd app
npm install
```

The last step is to start the working environment with Vagrant, 
from the root source code folder simply type the following command in the root directory in order to start the virtual machine.

The following command with create and provisionning the VM (installing nodejs and mysql)

```
vagrant up
```

Starting the application
-----------------

From the root source code folder, type the following command lines:

```
vagrant ssh
node /vagrant/app/server.js
```

When you're all set with installation and application is started, you should be able to access the application at `http://localhost:3030`

To-Do
-----

* Manage web dependencies with Bower
* Unit tests of parts of the engine with Mocha
* Integration tests of the whole stack with Mocha + Karma
* CI integration

Author
------

[Jerry Chanut](mailto:jerry.chanut@soprasteria.com)