output "vm_public_ip_address" {
  value = azurerm_linux_virtual_machine.my_terraform_vm.public_ip_address
}

output "elasticsearch_ip" {
  value = azurerm_container_group.elasticsearch.ip_address
}