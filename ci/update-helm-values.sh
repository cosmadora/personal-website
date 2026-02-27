#!/usr/bin/env bash

set -euo pipefail

export GREEN="\033[0;32m"
export RED="\033[0;31m"
export YELLOW="\033[1;33m"
export CLEAR="\033[0m"

function error {
    echo -e "${RED}$1${CLEAR}"
}

function warn {
    echo -e "${YELLOW}$1${CLEAR}"
}

function ok {
    echo -e "${GREEN}$1${CLEAR}"
}

if [[ -z "${IMAGE_LABEL:-}" ]]; then 
  error "IMAGE_LABEL is empty"
  exit 1
fi

if [[ -z "${ARGOCD_REPOS:-}" ]]; then
  error "ARGOCD_REPOS is empty"
  exit 1
fi

BOT_NAME="lila-network-ci-bot"
BOT_EMAIL="lila-network-ci-bot@itsadora.eu"

export GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no"

update_all_repos() {
  local values_path="$1"
  while IFS= read -r line; do
    # skip empty lines / comments
    [[ -z "${line// }" ]] && continue
    [[ "${line:0:1}" == "#" ]] && continue

    # split: first token = name, rest = url (falls mal spaces kommen)
    local name url
    name="$(awk '{print $1}' <<<"$line")"
    url="$(cut -d' ' -f2- <<<"$line")"

    if [[ -z "${name:-}" || -z "${url:-}" ]]; then
      warn "Skipping invalid ARGO_REPOS line (expected: <name> <url>)"
      continue
    fi

    ok "Starting update for ${name}"
    update_repo "$url" "$values_path" "$name"
  done <<< "${ARGOCD_REPOS:-}"
}

update_repo() {  local repo_url="$1"
  local path_to_values="$2"
  local repo_name="${3:-private-repo}"

  ok "Repo: ${repo_name}"
  ok "Image-Tag: $IMAGE_LABEL"
  ok "values.yaml path: $path_to_values"

  workdir="$(mktemp -d)"
  # cleanup auch wenn etwas schiefgeht
  trap 'rm -rf "$workdir"' RETURN

  warn "Cloning repo ${repo_name} into $workdir"
  git clone "$repo_url" "$workdir"
  pushd "$workdir" >/dev/null

  warn "Setting git user for commits to $BOT_NAME <$BOT_EMAIL>"
  git config user.name "$BOT_NAME"
  git config user.email "$BOT_EMAIL"

  warn "Enabling git commit signing"
  git config --global gpg.format ssh
  git config --global user.signingkey "$HOME/.ssh/id_ed25519.pub"


  warn "Updating image tag in $path_to_values"
  yq -i ".['adoras-website'].image.tag = \"${IMAGE_LABEL}\"" "$path_to_values"

  warn "Checking diff"
  if git diff --quiet; then
    ok "No changes in ${repo_name}"
    popd >/dev/null
    return 0
  fi

  warn "Committing and pushing changes to ${repo_name}"
  git add "$path_to_values"
  git commit -m "chore(deploy): adoras-website -> ${IMAGE_LABEL} [skip ci]"
  git push origin HEAD:main

  ok "Update completed for ${repo_name}"
  popd >/dev/null
}

update_all_repos "charts/website/values.yaml"
