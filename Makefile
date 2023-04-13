#
# Code generated by `gkgen`
#

.PHONY: build

# Environments
-include .env

# Get the value from a key of an yaml file
define get_yaml
$(shell yq -r ".$1" ".config/service.$2.yaml")
endef

# Service
NAME				= $(call get_yaml,name,base)
VERSION				= $(call get_yaml,version,base)
DESCRIPTION			= $(call get_yaml,description,base)
README				= $(call get_yaml,readme,base)

# Registry
REGISTRY			?= docker.io
REGISTRY_REPO		?= ezconnect
DOCKERFILE			?= Dockerfile

# Override the image & helm package names or the image tag
RELEASE_NAME		= $(NAME)
TAG					?= $(VERSION)

DEPLOYMENT_KIND		?= $(call get_yaml,deployment.kind,k8s)
HELM_REPO			?= freemind
HELM_NAMESPACE		?= dev

# list all targets
help:
	@grep -B1 -E "^[a-zA-Z0-9_%-]+:([^\=]|$$)" Makefile \
		| grep -v -- -- \
		| sed 'N;s/\n/###/' \
		| sed -n 's/^#: \(.*\)###\(.*\):.*/\2###\1/p' \
		| column -t -s '###'

#: remove untracked files from the working tree
clean:
#	go clean -cache -testcache -modcache -x
	gkgen clean $(arg)

#: Apply patches
patch-update:
	@npm run patch-update

#: Creates patches
patch:
	@npm run patch

#: Linting
lint:
	@npm run lint

#: Starts the application with autoReload enabled
run:
	@npm run develop

#: Starts the application with autoReload disabled
serve:
	@npm run start

#: Builds the admin panel
build:
	@NODE_ENV=production npm run build

# -----------------------------------------------------------------------------
# OCI
# -----------------------------------------------------------------------------
#: build the image
oci:
	podman build -t $(RELEASE_NAME):$(VERSION) -f $(DOCKERFILE) $(args) \
		--annotation org.opencontainers.image.created="$(shell date -I'seconds')" \
		--annotation org.opencontainers.image.description="$(DESCRIPTION)" \
		--annotation io.artifacthub.package.readme-url="$(README)"

#: push an image to a specified location that defined in '.makerc'
oci-push:
ifdef REGISTRY_USER
	podman login -u $(REGISTRY_USER) -p $(REGISTRY_PWD) $(REGISTRY)
else
	podman login $(REGISTRY)
endif

	podman push $(RELEASE_NAME):$(VERSION) $(REGISTRY)/$(REGISTRY_REPO)/$(RELEASE_NAME):$(TAG)

# -----------------------------------------------------------------------------
# Helm
# -----------------------------------------------------------------------------
#: generate the Helm chart
helm:
	gkgen helm $(args)
ifneq ($(NAME),$(RELEASE_NAME))
	sed -i -e 's/name: $(NAME)/name: $(RELEASE_NAME)/' .chart/Chart.yaml
endif
	cp .config/service.k8s.yaml .chart/values.yaml
ifneq ($(wildcard .chart/Chart.lock),)
	rm .chart/Chart.lock
endif
	helm dependency build .chart/
	helm lint .chart/

#: render chart templates locally and write to '.chart/k8s.yaml'
pod: helm
	helm template $(RELEASE_NAME) .chart/ > .chart/k8s.yaml

#: upload chart to the repo that defined in '.makerc'
package: helm
	helm cm-push .chart/ $(HELM_REPO)

#: install the chart to a remote defined in '.makerc'
install:
	helm repo update && helm install $(RELEASE_NAME) $(HELM_REPO)/$(RELEASE_NAME) -n $(HELM_NAMESPACE) --version $(VERSION) $(args)

#: upgrade the release to the current version of the chart
upgrade:
	helm repo update && helm upgrade $(RELEASE_NAME) $(HELM_REPO)/$(RELEASE_NAME) -n $(HELM_NAMESPACE) --version $(VERSION) $(args)

#: restart the release
restart:
	kubectl rollout restart $(DEPLOYMENT_KIND)/$(RELEASE_NAME) -n $(HELM_NAMESPACE)

#: uninstall the release
uninstall:
	helm uninstall $(RELEASE_NAME) -n $(HELM_NAMESPACE)

#: execute the release
exec:
	kubectl exec -it $(DEPLOYMENT_KIND)/$(RELEASE_NAME) -n $(HELM_NAMESPACE) -- sh

#: print the logs for the deployment
logs:
	kubectl logs $(DEPLOYMENT_KIND)/$(RELEASE_NAME) -f -n $(HELM_NAMESPACE) --timestamps

#: stop the release
stop:
	kubectl scale --replicas=0 $(DEPLOYMENT_KIND)/$(RELEASE_NAME) -n $(HELM_NAMESPACE)
