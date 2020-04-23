# TODO: figure out how to do kubectl -k k8s/bases with CRDS

# TRY THIS BELOW WITH v0.13
# kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.12.0/cert-manager-no-webhook.yaml



kubectl create namespace cert-manager &&
kubectl label namespace cert-manager certmanager.k8s.io/disable-validation=true --overwrite &&
k apply -f k8s/bases/cert-manager/crds.yaml &&
k apply -f k8s/bases/cert-manager/cert-manager-v0.9.1.yaml &&
k apply -f k8s/bases/prometheus-operator/crd-alertmanager.yaml &&
k apply -f k8s/bases/prometheus-operator/crd-podmonitor.yaml &&
k apply -f k8s/bases/prometheus-operator/crd-prometheus.yaml &&
k apply -f k8s/bases/prometheus-operator/crd-prometheusrules.yaml &&
k apply -f k8s/bases/prometheus-operator/crd-servicemonitor.yaml &&
k apply -f k8s/bases/prometheus-operator/crd-thanosrulers.yaml


# kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.9.1/cert-manager.yaml

# kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.9.1/cert-manager.yaml

# TODO: for password hash: htpasswd -B htpasswd_file username
