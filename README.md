# Demo Project for Automated Deployment to Azure Cloud with Terraform and Ansible

This repository contains the code for automating the deployment of a Node.js application to the Azure Cloud using Terraform and Ansible. Additionally, it includes configurations for Prometheus and Grafana monitoring, as well as the ELK (Elasticsearch, Logstash, Kibana) stack for logging purposes.


## Overview

The deployment process involves the creation of a virtual machine (VM) and a container group in Azure. The container group hosts Elasticsearch and Kibana containers for logging, while the VM serves as the host for the Node.js application. Logstash is configured on the VM to send data to Elasticsearch for centralized logging. Additionally, Prometheus and Grafana are set up for monitoring the application's performance and metrics.

## Requirements

  - Azure subscription
  - Terraform and Ansible installed locally
  - Configure Terraform variables:
        
      - Create the terraform.tfvars file with your Azure credentials and other necessary variables.


## Terraform

The Terraform configuration is used to deploy a **virtual machine** (VM) in Azure, along with a **container group** that hosts Elasticsearch and Kibana containers.


The following steps are required to perform this deployment after cloning the repository and navigating to the terraform directory:

1. Initialize Terraform to prepare the environment:

  ```bash
  terraform init
  ```

2. Configure Terraform Variables

Update the `terraform.tfvars` file with your Azure credentials and any other necessary variables

3. Apply the Terraform configurations to create the VM and container group:

  ```bash
  terraform apply
  ```


4. Initialize Terraform to prepare the environment:

  ```bash
  terraform init
  ```


To clean up and delete all resources created by Terraform, run:
  ```bash
  terraform destroy
  ```

**Note:**
The directory also has a `docker_files` subdirectory, which containes a Dockerfile with the command to create the Logstash, Elasticsearch, Kibana images, as well as the necessary configuration files.


## Ansible

This section outlines the Ansible automation for deploying and configuring various components of the infrastructure. The Ansible playbook, named `deploy.yml`, orchestrates the deployment process using multiple roles to perform the setup.

Before running the Ansible playbook, make sure the following requirements are met:

- Ansible installed on your local machine
- Correctly configured inventory file (`inventory`) containing the IP address of the target VM and the ansible_ssh_private_key_file 
- Updated Logstash `pipeline.conf` file with the Elasticsearch output IP

To run the **Ansible Playbook** use the following command:
```bash
  ansible-playbook -i inventory deploy.yml
```

The deploy.yml playbook consists of the following roles:

- `node_mysql_install`: Installs Node.js, npm, and MySQL on the VM.
- `prometheus_grafana_install`: Installs Prometheus and Grafana for monitoring purposes.
- `nodejs_app`: Deploys the Node.js application and configures the database.
- `monitoring_config`: Configures Prometheus and Grafana for monitoring.
- `logstash`: Installs and configures Logstash to send the logs to Elasticsearch.
- `node_start`: Starts the Node.js application if needed