# cms

Home CMS

## TL;DR

```console
$ helm repo add --username <username> --password <password> freemind https://gitlab.com/api/v4/projects/29088262/packages/helm/freemind
$ helm install cms freemind/cms
```

## Introduction

Home CMS

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+

## Installing

Install the chart using:

```bash
$ helm repo add --username <username> --password <password> freemind https://gitlab.com/api/v4/projects/29088262/packages/helm/freemind
$ helm install cms freemind/cms
```

These commands deploy `cms` on the Kubernetes cluster in the default configuration and with the release name cms. The deployment configuration can be customized by specifying the customization parameters with the `helm install` command using the `--values` or `--set` arguments. Find more information in the [configuration section](#configuration) of this document.

> **TIP**: List all releases using `helm list -A`

## Upgrading

Upgrade the chart deployment using:

```bash
$ helm upgrade cms freemind/cms
```

The command upgrades the existing `cms` deployment with the most latest release of the chart.

> **TIP**: Use `helm repo update` to update information on available charts in the chart repositories.

## Uninstalling

To uninstall/delete the `cms` deployment:

```bash
helm uninstall cms
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

> **TIP**: Specify the `--purge` argument to the above command to remove the release from the store and make its name free for later use.

## Configuration

The following tables lists all the configurable parameters expose by the chart and their default values.

### Common parameters

| Name                | Description                                                                                       | Default |
| ------------------- | ------------------------------------------------------------------------------------------------- | ------- |
| `kubeVersion`       | Override Kubernetes version                                                                       | `""`    |
| `imagePullSecrets`  | Docker registry secret names as an array                                                          | `[]`    |
| `nameOverride`      | Partially override `mpi-operator.fullname` template with a string (will prepend the release name) | `nil`   |
| `fullnameOverride`  | Fully override `mpi-operator.fullname` template with a string                                     | `nil`   |
| `commonAnnotations` | Annotations to add to all deployed objects                                                        | `{}`    |
| `commonLabels`      | Labels to add to all deployed objects                                                             | `{}`    |

### Parameters

| Name               | Description                                 | Default                   |
| ------------------ | ------------------------------------------- | ------------------------- |
| `replicaCount`     | Number of replicas                          | `1`                       |
| `image.repository` | Image name                                  | `docker.io/ezconnect/cms` |
| `image.tag`        | Image tag                                   | `0.2.0`                   |
| `image.pullPolicy` | Image pull policy                           | `IfNotPresent`            |
| `ingress.enabled`  | Enable ingress controller resource          | `true`                    |
| `ingress.hostname` | Default host for the ingress resource       | `freemind.com.vn`         |
| `ingress.tls`      | Enable TLS for `ingress.hostname` parameter | `staging-tls`             |
