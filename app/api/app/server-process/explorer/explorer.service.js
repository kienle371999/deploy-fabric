const { Explorer, Network, Peer, Organization } = require('../../models')
const yaml = require('js-yaml')
const fs = require('fs')
const { spawnSync, spawn } = require("child_process")
const { defaultNetwork } = require('../../utils/constant')

const _vArgs = (arg) => {
  if(typeof arg !== 'string' || arg.length === 0) return false
  return true
}

const getExplorer = async() => {
  try {

    const network = await Network.findOne({ name: defaultNetwork })
    if(!network) return null

    const vExplorer = await Explorer.findOne({ network: network._id })
    if(!vExplorer) return null
    return vExplorer
  }
  catch(error) {
    throw new Error(error.message)
  }
}

const createExplorer = async(args) => {
  const validateArgs = async() => {
    const { name, port } = args
    if(!_vArgs(name)) throw new Error('Explorer Name must be non-empty')
    if(!_vArgs(port)) throw new Error('Explorer Port must be non-empty')

    const vCAPort = await Organization.findOne({ ca_port: port })
    const vCouchDBPort = await Peer.findOne({ couchdb_port: port })
    if(vCAPort || vCouchDBPort) throw new Error('Duplicate Explorer Port')
    return args
  }

  try {
    const vArgs = await validateArgs(args)
    const network = await Network.findOne({ name: defaultNetwork })
    if(!network) return null
    const vExplorer = await Explorer.create({ network: network._id, ...vArgs })

    const templateConfig = { explorer: { enabledPostgres: true, port: vExplorer.port } }
    const yamlStr = yaml.safeDump(templateConfig)
    fs.writeFileSync('yaml-generation/explorer-config.yaml', yamlStr, 'utf8')
    const configPath = process.env.PWD.concat('/yaml-generation/explorer-config.yaml')
    console.log("createExplorer -> configPath", configPath)
    const res = spawnSync('bash', ['../../../install-explorer.sh', network.name.toLowerCase(), configPath])
    if(res.status !== 0) {
      console.log('Blockchain Error', res.stderr.toString())
    }
    else {
      console.log('System-data', res.stdout.toString())
      console.log('Blockchain-data', res.stderr.toString())
      return await Network.findByIdAndUpdate(network._id, { status: status.running })
    }

  }
  catch(error) {
    throw new Error(error.message)
  }
}


module.exports = {
    getExplorer,
    createExplorer
}