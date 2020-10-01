# ONLY PROVEN TO WORK VERSION:
# kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.9.1/cert-manager.yaml

# also https://github.com/helm/charts/tree/master/stable/prometheus-postgres-exporter

# in order to cert-manager correctly we need to do this:
# kubectl delete -f https://github.com/jetstack/cert-manager/releases/download/v0.14.2/cert-manager.yaml
# kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.14.2/cert-manager.yaml








stolonctl --cluster-name=kube-stolon --store-backend=kubernetes --kube-resource-kind=configmap init --yes '{ "initMode": "new", "pgParameters": {"ssl":"off","ssl_ca_file":null,"ssl_cert_file":null,"ssl_key_file":null}  }'
psql --host izel-stolon-proxy --port 5432 postgres -U stolon -W




# NOTE: use this script only when k8s cant remove the cert-manager correctly
kubectl get namespace cert-manager -o json >tmp.json

nvim tmp.json
kubectl proxy

curl -k -H "Content-Type: application/json" -X PUT --data-binary @tmp.json http://127.0.0.1:8001/api/v1/namespaces/cert-manager/finalize


