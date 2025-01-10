# CreatioART: Template Node.js Express Service

[![Release Level](https://img.shields.io/badge/release%20level-stable-brightgreen.svg?style=flat)]()
[![NPM Core Version](https://img.shields.io/npm/v/@creatioart-js/express-core.svg)](https://www.npmjs.com/package/@creatioart-js/express-core)

CreatioART - Template Node.js Express Service for Express framework it's a template for a Restful API.
This template can be applied to any web component such as:

- NodeJS Enviroments
- Serverless Engine
- Kubernate Engine
- Node Express Server

## Getting Started

1. [Artifact](#artifact)
1. [Requirements](#requirements)
1. [Project organization](#project-organization)
1. [Building from Source](#building-from-source)
1. [Test the Artifact](#test-the-artifact)
1. [Run in Local Mode](#run-in-local-mode)
1. [Documentation](#documentation)
1. [CreatioART templates](#creatioart-templates)
1. [License](#license)
1. [Change Log](#change-log)

### Templates for use

Service templates are public. `README.md` file for each template contains instructions for running it.

| Source Code                                                                        | Status                                                                                               |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [Express Service](https://github.com/creatioart/template-nodejs-express-service)   | [![Release Level](https://img.shields.io/badge/release%20level-stable-brightgreen.svg?style=flat)]() |
| [Express Function](https://github.com/creatioart/template-nodejs-express-function) | [![Release Level](https://img.shields.io/badge/release%20level-stable-brightgreen.svg?style=flat)]() |

## Artifact

| Element       | Description                                 |
| ------------- | ------------------------------------------- |
| Artifact id   | @creatioart/template-nodejs-express-service |
| Artifact Name | template-nodejs-express-service             |

## Requirements

####

To build and run the application you need:

- [Node.js 20](https://nodejs.org/dist/v20.18.0)
- Projects must configure [TypeScript](https://typescriptlang.org) to use types from the ECMAScript modules that have a:
  - [`compilerOptions.allowJs`](https://typescriptlang.org/tsconfig#allowJs) should be `true`.
  - [`compilerOptions.module`](https://typescriptlang.org/tsconfig#module) should be `"node16"` or `"nodenext"`.

## Project organization

The code is organized as follows:

1. `config` contains the application settings.
1. `controller` contains application controllers.
1. `dto` contains the data transfer object.
1. `entity` contains the persistence domains.
1. `enum` contains the enumerations that set the domain values.
1. `locator` contains the resource location classes such as: Config, Service, Repository and Resource.
1. `repository` contains the data manipulation repositories.
1. `service` contains the interfaces and implementations that define the functionality provided by the service.

## Building from Source

1. Install Node.js 20 - [Node.js 20 Download](https://nodejs.org/dist/v20.18.0)
1. Install dependencies: npm install
1. Run compile: npm run build

## Test the Artifact

1. Install Node.js 20 - [Node.js 20 Download](https://nodejs.org/dist/v20.18.0)
1. Install dependencies: npm install
1. Run test: npm run test

## Run in Local Mode

1. Install Node.js 20 - [Node.js 20 Download](https://nodejs.org/dist/v20.18.0)
1. Install dependencies: npm install
1. Create the enviroment file `.configuration\local.env` from the `.configuration\example.env` file.
1. Run develop: npm run dev

## Documentation

Swagger Reference: [Swagger](swagger/swagger.yaml)

## CreatioART templates

Complementary templates available from CreatioART:

Made with ❤️ by the CreatioART team.

- https://www.npmjs.com/org/creatioart-js

## Contribute

If you are interested in fixing issues and contributing directly to the code,
please contact to the project manager. Here is how you can contribute to CreatioART.template-nodejs-express-service:

- Submit bugs and help us verify fixes
- Submit pull requests for bug fixes and features and discuss existing proposals

## License

[Apache-2.0](LICENSE)

## Change Log

[Change Log](CHANGELOG.md)
