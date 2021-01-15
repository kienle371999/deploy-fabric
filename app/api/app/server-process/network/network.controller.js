const { addNetworkService } = require('./network.service')

const addNetwork = async (req, res) => {
    const newNetwork = await addNetworkService(req.body)
    return res.status(newNetwork.status).json(newNetwork.data)
}

module.exports = {
    addNetwork
}

