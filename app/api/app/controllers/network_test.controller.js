const config = require("../config/auth.config");
const db = require("../models");
const Network = db.db.network;
const Log = db.db.log;

const yaml = require('js-yaml');
const _ = require('lodash');

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const getNetworks = async (req, res) => {
  Network.find().exec((err, networks) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send(networks);
  });
};

const getNetwork = async (req, res) => {
  Network.findById(req.params.networkId).exec((err, network) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send(network);
  });
};

const addNetwork = async (req, res) => {
  const network = new Network({
    name: req.body.name,
    status: "Initial",
    orgs: req.body.orgs,
  });

  network.save((err, network) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    res.status(200).send(network);
  });
};

const startNetwork = async (req, res) => {
  Network.findById(req.params.networkId).exec((err, network) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (network.status != "Initial") {
      res.status(400).send({ message: "Network must be in status Initial" });
      return;
    }

    let networkConfig = {orgs: []};
    _.each(network.orgs, (org) => {
      networkConfig.orgs.push({
        Name: org.name,
        Domain: org.domain,
        PeerCount: 1,
        UserCount: 1
      });
    });

    let yamlStr = yaml.safeDump(networkConfig);
    fs.writeFileSync('network-config.yaml', yamlStr, 'utf8');
    let configPath = process.env.PWD + '/network-config.yaml';

    const ls = spawn("bash", ["../../../generate-config.sh", network.name.toLowerCase(), configPath]);

    ls.stdout.on("data", (data) => {
      Log.create({
        networkId: network._id,
        message: data
      });
    });

    ls.stderr.on("data", (data) => {
      Log.create({
        networkId: network._id,
        message: "Err: " + data
      });
    });

    ls.on("close", (code) => {
      Log.create({
        networkId: network._id,
        message: `The process exited with code ${code}`
      });
      if (code == 0) {
        network.status = 'Running';
        network.save();
      }
    });

    res.status(200).send(network);
  });
};

const stopNetwork = async (req, res) => {
  Network.findById(req.params.networkId).exec((err, network) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (network.status != "Running") {
      res.status(400).send({ message: "Network must be in status Running" });
      return;
    }

    const ls = spawn("bash", ["../../../clean.sh", network.name.toLowerCase()]);

    ls.stdout.on("data", (data) => {
      Log.create({
        networkId: network._id,
        message: data
      });
    });

    ls.stderr.on("data", (data) => {
      Log.create({
        networkId: network._id,
        message: "Err: " + data
      });
    });

    ls.on("close", (code) => {
      Log.create({
        networkId: network._id,
        message: `The process exited with code ${code}`
      });
      if (code == 0) {
        network.status = 'Initial';
        network.save();
      }
    });

    res.status(200).send(network);
  });
};

const getLogs = async (req, res) => {
  Log.find({ networkId: req.params.networkId }).exec((err, logs) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send(logs);
  });
};
const clearLogs = async (req, res) => {
  Log.deleteMany({ networkId: req.params.networkId }, (err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).send('success');
  });
};

module.exports = {
  getNetworks: getNetworks,
  getNetwork: getNetwork,
  addNetwork: addNetwork,
  startNetwork: startNetwork,
  stopNetwork: stopNetwork,
  getLogs: getLogs,
  clearLogs: clearLogs
};
