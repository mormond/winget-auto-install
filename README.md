# Demo - Infrastructure Request using Terraform
A demo project to show how you can use GitHub Actions to fulfill infrastructure provisioning requests with Terraform

## Summary

We want to maintain a process that allows people to provision a known-good set of infrastructure in Azure. There should be a log of who deployed what, why and when, with central controls and governance on exactly what it is that get deployed.

There should be sharing or exposing of credentials anywhere in the process.

## Solution

We maintain a series of Terraform templates in this local repository. You can deploy any of these approved templates by raising an issue on GitHub.

Only specific people can commit to this repository to give some level of control on the existing templates.

This enables us to have seperate workflows for building and maintaining the templates as well as deploying them.

## Set up

Create a service principal to allow access to your managed subscription with least privilege, probably not Contributor to your entire subscription

```
az login
az account list
az account set --subscription="XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX"
az ad sp create-for-rbac --sdk-auth --appId "demo-tf-infra-request" --role "Contributor" --scopes "/subscriptions/XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXX"
```

Add GitHub a secret for the service principal just created, called `AZURE_CREDENTIALS`. The relevant parts are extracted in an initial step to populate the `$GITHUB_ENV`

## Fun Extras

1. [Use a local action in a workflow](.github/workflows/env-req-workflow.yml#L24)
1. [Pass local config to an action](infrastructure/templates.json)
1. [Add a comment in a GitHub workflow](.github/workflows/env-req-workflow.yml#L118-L123)
1. [Share uploaded artifacts between runs](.github/workflows/env-req-workflow.yml#L164-L169)

