provider "azurerm" {
  skip_provider_registration = true
  features {}
}

variable "resource_group_name" {
  type        = string
  default     = "default-resource-group"
  description = "The name of resource group"
}

variable "location" {
  type        = string
  default     = "uksouth"
  description = "Location"
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}