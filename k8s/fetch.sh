mkdir -p ./bases/cert-manager ./bases/argo-cd ./bases/argo ./bases/prometheus-operator &&

wget https://github.com/jetstack/cert-manager/releases/download/v0.9.1/cert-manager.yaml -O ./bases/cert-manager/cert-manager-v0.9.1.yaml &&
wget https://github.com/jetstack/cert-manager/releases/download/v0.16.0/cert-manager.crds.yaml -O ./bases/cert-manager/crds.yaml &&
# wget https://github.com/jetstack/cert-manager/releases/download/v0.16.0/cert-manager.crds.yaml -O ./bases/cert-manager/crds.yaml &&

# prometheus-operator
wget https://raw.githubusercontent.com/argoproj/argo/stable/manifests/install.yaml -O ./bases/argo/manifests.yaml &&
wget https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml -O ./bases/argo-cd/manifests.yaml

