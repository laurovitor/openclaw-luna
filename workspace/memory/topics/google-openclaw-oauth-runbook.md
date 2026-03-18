Tags: google, oauth, gog, runbook, openclaw

# Google OAuth via gog on Raspberry / OpenClaw

## Goal
Enable Luna/OpenClaw on the Raspberry to access Lauro's Google surfaces with `gog`:
- Gmail
- Calendar
- Drive
- Docs
- Sheets
- Contacts

## Files / paths
- OAuth client JSON: `/home/laurovitor/.openclaw/credentials/google.json`
- gog copied credentials: `/home/laurovitor/.config/gogcli/credentials.json`
- gog keyring password file: `/home/laurovitor/.openclaw/credentials/gog_keyring_password`
- gog keyring storage: `~/.local/share/keyrings/gogcli.keyring`
- gog binary: `/home/laurovitor/.nvm/versions/node/v24.14.0/bin/gog`

## What was installed
- Correct CLI for this flow is npm package `@autonia/gog` (not a Python package).
- `pip install gog` failed because there is no matching PyPI package for this use case.

## Install / verify gog
```bash
npm install -g @autonia/gog
/home/laurovitor/.nvm/versions/node/v24.14.0/bin/gog --help
```

## Important gotcha: keyring password
`gog` requires `GOG_KEYRING_PASSWORD` when using the file keyring backend. Without it, OAuth can complete in the browser but token persistence fails with:

`Error: GOG_KEYRING_PASSWORD environment variable is required for file keyring`

### Fix used
Create a local password file once and export it before `gog` auth/token commands:

```bash
PASS_FILE=/home/laurovitor/.openclaw/credentials/gog_keyring_password
[ -f "$PASS_FILE" ] || (umask 077 && openssl rand -hex 32 > "$PASS_FILE")
export GOG_KEYRING_PASSWORD="$(cat "$PASS_FILE")"
```

## OAuth credential setup
Register the Google OAuth Desktop App in Google Cloud Console and download the client JSON to:

`/home/laurovitor/.openclaw/credentials/google.json`

Then copy it into gog config:

```bash
export GOG_KEYRING_PASSWORD="$(cat /home/laurovitor/.openclaw/credentials/gog_keyring_password)"
/home/laurovitor/.nvm/versions/node/v24.14.0/bin/gog auth credentials /home/laurovitor/.openclaw/credentials/google.json
```

## Requested services / permissions
The agreed services for Lauro were:
- Gmail: full access for reading/sending
- Calendar: full access
- Drive: full access, but Luna must never delete anything without explicit permission
- Docs: access for reading/working on shared docs when asked
- Sheets: access for reading/updating when asked
- Contacts: full access

Operational command used for OAuth:

```bash
export GOG_KEYRING_PASSWORD="$(cat /home/laurovitor/.openclaw/credentials/gog_keyring_password)"
/home/laurovitor/.nvm/versions/node/v24.14.0/bin/gog auth add laurovitor@gmail.com --services gmail,calendar,drive,docs,sheets,contacts
```

## Browser callback workaround
The callback comes back to `http://localhost/?code=...`. If interactive terminal flow is inconvenient, exchange the code manually against Google's token endpoint and then import into gog.

### Manual exchange
```bash
python3 - <<'PY'
import json, urllib.parse, urllib.request
client=json.load(open('/home/laurovitor/.openclaw/credentials/google.json'))['installed']
data=urllib.parse.urlencode({
  'code':'PASTE_AUTH_CODE_HERE',
  'client_id':client['client_id'],
  'client_secret':client['client_secret'],
  'redirect_uri':'http://localhost',
  'grant_type':'authorization_code'
}).encode()
req=urllib.request.Request('https://oauth2.googleapis.com/token', data=data, headers={'Content-Type':'application/x-www-form-urlencoded'})
resp=urllib.request.urlopen(req)
obj=json.loads(resp.read().decode())
obj['email']='laurovitor@gmail.com'
open('/tmp/gog-token.json','w').write(json.dumps(obj))
print('wrote /tmp/gog-token.json')
PY
```

### Import token into gog
```bash
export GOG_KEYRING_PASSWORD="$(cat /home/laurovitor/.openclaw/credentials/gog_keyring_password)"
/home/laurovitor/.nvm/versions/node/v24.14.0/bin/gog auth tokens import /tmp/gog-token.json
/home/laurovitor/.nvm/versions/node/v24.14.0/bin/gog auth list
```

Expected result:
- account `laurovitor@gmail.com` listed as default

## Google Cloud APIs that had to be enabled
Enable these APIs in the same Google Cloud project used by the OAuth client:
- Gmail API
- Google Calendar API
- Google Drive API
- Google Docs API
- Google Sheets API
- People API

Without this, auth may succeed while service calls still fail (example observed: Drive API disabled error).

## Validations performed successfully
With `GOG_KEYRING_PASSWORD` exported:

### Calendar
```bash
gog calendar list
```
Worked and listed calendars, including `laurovitor@gmail.com` as primary.

### Drive
```bash
gog drive list
```
Worked after Drive API was enabled.

### Contacts
```bash
gog contacts list
```
Worked and listed contacts.

### Docs
```bash
gog docs cat <DOC_ID>
```
Worked on a shared Google Doc. Example validated doc id:
- `1FQ5p4M-qg6gWQ6907zpQaEHbO1AJH3hi5n5R3Z7vgoI`

### Gmail inbox
```bash
gog gmail search 'in:inbox'
```
Worked and listed inbox threads.

### Gmail send
```bash
gog gmail send --to laurovitor@imoblist.com.br --subject 'Teste de envio Gmail via Luna / OpenClaw' --body-file /path/to/body.txt --json
```
Worked. One test using `--body` with escaped newlines delivered literal `\n`, so prefer `--body-file` or stdin for proper formatting.

## Practical rules after validation
- Gmail reading: OK
- Gmail sending: OK
- Calendar: OK
- Drive: OK
- Contacts: OK
- Docs reading by link/ID: OK
- Sheets access available via `get`, `update`, `append`, `clear`, `metadata`
- For Drive deletion, never delete without Lauro's explicit permission.

## Useful commands
```bash
export GOG_KEYRING_PASSWORD="$(cat /home/laurovitor/.openclaw/credentials/gog_keyring_password)"
GOG=/home/laurovitor/.nvm/versions/node/v24.14.0/bin/gog

$GOG auth list
$GOG gmail search 'in:inbox' --max 10
$GOG calendar list
$GOG drive list
$GOG contacts list
$GOG docs cat <DOC_ID>
$GOG sheets metadata <SPREADSHEET_ID>
```
