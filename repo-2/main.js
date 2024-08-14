const express = require('express');
const app = express();

class ConfigMessage {
  constructor(logLevel, grpcPort, environment, dbUrl, podIP) {
    this.log_level = logLevel;
    this.grpc_port = grpcPort;
    this.environment = environment;
    this.db_url = dbUrl;
    this.pod_ip = podIP;
  }
}

class DomainMessage {
  constructor(endpoint, domain, logLevel) {
    this.endpoint = endpoint;
    this.domain = domain;
    this.log_level = logLevel;
  }
}

class LoadCapabilityMessage {
  constructor(cpu, memory) {
    this.cpus = cpu;
    this.memorys = memory;
  }
}

const getEnvVariable = (key, defaultValue) => {
  return process.env[key] || defaultValue;
};

const getConfig = (req, res) => {
  const logLevel = getEnvVariable('LOG_LEVEL', 'debug');
  const grpcPort = getEnvVariable('GRPC_PORT', '8080');
  const environment = getEnvVariable('ENVIRONMENT', 'dev');
  const dbURL = getEnvVariable('DB_URL', 'postgres://admin:supersecret@10.10.10.1:5432/exam-db');
  const podIP = getEnvVariable('POD_IP', '10.10.10.10');

  const message = new ConfigMessage(logLevel, grpcPort, environment, dbURL, podIP);
  res.json(message);
};

const getDomain = (req, res) => {
  const host = req.get('Host');
  console.log(`Host: ${host}`);

  const logLevel = getEnvVariable('LOG_LEVEL', 'debug');
  const message = new DomainMessage('/domain', host, logLevel);
  res.json(message);
};

const getLoad = (req, res) => {
  const cpuLimit = getEnvVariable('CPU', '0.1');
  const memoryLimit = getEnvVariable('MEMORY', '32Mi');

  const message = new LoadCapabilityMessage(cpuLimit, memoryLimit);
  res.json(message);
};

const getHealth = (req, res) => {
  const message = {
    'health': 'true'
  }
  res.json(message);
};

app.get('/config', getConfig);
app.get('/domain', getDomain);
app.get('/load-capability', getLoad);
app.get('/health');

const port = 80;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
