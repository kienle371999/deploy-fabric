mydir=$(dirname "$0")
cd $mydir

function json_config {
  sed -e "s/\${CHANNEL_NAME}/$1/" \
      -e "s/\${ORG_NAME}/$2/" \
      template/config-template.json
}

echo "$(json_config $1 $2)" > config.json