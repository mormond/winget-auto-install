terraform {
  required_version = ">= 1.0.0"
  required_providers {
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  skip_provider_registration = true
  features {}
}

variable "resource_group_name" {
  type        = string
  default     = "aks-resource-group"
  description = "The name of resource group"
}

variable "location" {
  type        = string
  default     = "uksouth"
  description = "Location"
}

resource "random_pet" "primary" {}

resource "azurerm_resource_group" "example" {
  name     = var.resource_group_name
  location = var.location
}

# Create VNET for AKS
resource "azurerm_virtual_network" "vnet" {
  name                = "private-network"
  address_space       = ["10.0.0.0/8"]
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
}

# Create the Subnet for AKS.
resource "azurerm_subnet" "aks" {
  name                 = "aks"
  resource_group_name  = azurerm_resource_group.example.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.240.0.0/16"]
}

# Create the AKS cluster.
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "aks-${random_pet.primary.id}"
  location            = azurerm_resource_group.example.location
  resource_group_name = azurerm_resource_group.example.name
  dns_prefix          = "aks-${random_pet.primary.id}"

  default_node_pool {
    name            = "default"
    node_count      = 1
    vm_size         = "Standard_D2s_v3"
    os_disk_size_gb = 30
    os_disk_type    = "Ephemeral"
    vnet_subnet_id  = azurerm_subnet.aks.id
  }

  # Using Managed Identity
  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "azure"
    network_policy = "azure"
  }

  role_based_access_control {
    enabled = true
  }
}
