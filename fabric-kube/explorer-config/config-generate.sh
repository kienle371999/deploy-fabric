mydir=$(dirname "$0")
cd $mydir

function json_config {
  sed -e "s/\${ORG_NAME}/$1/" \
      template/config-template.json
}

echo "$(json_config $1)" > config.json