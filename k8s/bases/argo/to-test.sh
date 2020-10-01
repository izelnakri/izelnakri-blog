curl http://localhost:1235/submit-workflow-result \
  -fs \
  -H "Authorization: Bearer 4d99f2b556391a4ca5180a0f4a0bc15e68ddf102773026d8b0ee49b67ba8def3" \
  -H "Content-Type: application/json" \
  -X POST \
  -d {{workflow}}
