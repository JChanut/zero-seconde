require 'socket'

local_ip = Socket::getaddrinfo(Socket.gethostname,"echo",Socket::AF_INET)[0][3]

Vagrant.configure(2) do |config|
  config.vm.box = "ddsim-pmm-precise64"
  config.vm.box_url = "http://10.105.132.141:8080/docs-caasm/ddsim-pmm-precise64.box"
  config.vm.hostname = "zero-seconde"
  config.vm.provision "shell", path: "nvm-install.sh", privileged: false
  config.vm.network "forwarded_port", guest: 3030, host: 3030, id: "web"
  
  if Vagrant.has_plugin?("vagrant-proxyconf")
    config.proxy.http     = "http://" + local_ip + ":3128"
    config.proxy.https    = "http://" + local_ip + ":3128"
    config.proxy.no_proxy = "localhost,127.0.0.1," + local_ip
  end
end
