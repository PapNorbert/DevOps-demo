variable "subscription_id" { 
}
variable "client_id" { 
}
variable "client_secret" { 
}
variable "tenant_id" { 
}

variable "resource_group_location" {
  type        = string
  default     = "Germany West Central"
  description = "Location of the resource group."
}

variable "resource_group_name" {
}

variable "username" {
  type        = string
  description = "The username for the local account that will be created on the new VM."
  default     = "azureadmin"
}

variable "key_pair_name" {
}
variable "public_key_path" {
}
variable "private_key_path" {
}

variable "elasticsearch_image" {
  default = "papnorbert25/my-elasticsearch-image2:latest"
}

variable "logstash_image" {
  default = "papnorbert25/my-logstash-image:2"
}

variable "kibana_image" {
  default = "papnorbert25/my-kibana-image:latest"
}