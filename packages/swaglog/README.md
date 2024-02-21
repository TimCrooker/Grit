Swaglog
=======

Introduction
------------

Swaglog is a powerful console logger designed to enhance logging capabilities in your applications. It provides a straightforward and efficient way to produce more readable and informative log messages.

Table of Contents
-----------------

- [Introduction](https://chat.openai.com/g/g-wpMtgVmzG-readme-generator#introduction)
- [Installation](https://chat.openai.com/g/g-wpMtgVmzG-readme-generator#installation)
- [Usage](https://chat.openai.com/g/g-wpMtgVmzG-readme-generator#usage)
- [Features](https://chat.openai.com/g/g-wpMtgVmzG-readme-generator#features)
- [Dependencies](https://chat.openai.com/g/g-wpMtgVmzG-readme-generator#dependencies)
- [Configuration](https://chat.openai.com/g/g-wpMtgVmzG-readme-generator#configuration)
- [Documentation](https://chat.openai.com/g/g-wpMtgVmzG-readme-generator#documentation)
- [Examples](https://chat.openai.com/g/g-wpMtgVmzG-readme-generator#examples)
- [Troubleshooting](https://chat.openai.com/g/g-wpMtgVmzG-readme-generator#troubleshooting)
- [Contributors](https://chat.openai.com/g/g-wpMtgVmzG-readme-generator#contributors)
- [License](https://chat.openai.com/g/g-wpMtgVmzG-readme-generator#license)

Installation
------------

To install Swaglog, run the following command in your project directory:

bashCopy code

`npm install swaglog`

Usage
-----

Swaglog is designed to be highly customizable through various options. Here is a basic example of how to use Swaglog in your project:

typescriptCopy code

`import { Logger, LogLevel } from 'swaglog';

const logger = new Logger({
  logLevel: LogLevel.INFO,
  timestampFormat: 'yyyy-MM-dd HH:mm:ss',
});

logger.info('This is an informational message');`

Save to grepper

This example creates a new `Logger` instance with a specified log level and timestamp format, then logs an informational message.

Features
--------

Swaglog provides the following features:

- Customizable Log Levels: Define what levels of logging are important for your project, including DEBUG, INFO, WARN, and ERROR.
- Flexible Logging Targets: Out of the box, logs are written to the console, but you can define custom log targets to direct your logs elsewhere.
- Structured Logging: Opt-in to structured logging to produce JSON-formatted log entries, making them easier to parse and process programmatically.
- Timestamped Entries: Customize the timestamp format of your log entries for consistency and clarity.

Configuration
-------------

When initializing the `Logger`, you can configure it with the following options:

- `logLevel`: The minimum level of messages to log. This allows you to control the verbosity of your application's logging.
- `mock`: A boolean to enable mock mode, useful for testing without sending logs to actual log targets.
- `logTargets`: An array of log targets where log messages will be sent. By default, logs are written to the console, but you can implement and use custom log targets.
- `structuredLogging`: Enable structured logging to output logs in a JSON format.
- `timestampFormat`: Customize the format of timestamps in log messages using `date-fns` formatting options.

Examples
--------

Here are some advanced usage examples of Swaglog:

1. Custom Log Target:

    Implement a custom log target to redirect log messages to a file or an external logging service.

    typescriptCopy code

    `import { Logger, LogLevel, LogTarget } from 'swaglog';

    class FileLogTarget implements LogTarget {
      log(level: LogLevel, message: string): void {
        // Implementation to log message to a file
      }
    }

    const logger = new Logger({
      logLevel: LogLevel.DEBUG,
      logTargets: [new FileLogTarget()],
    });

    logger.debug('Debugging message');`

2. Structured Logging:

    Enable structured logging to get log messages in JSON format for easy processing by log management tools.

    typescriptCopy code

    `const logger = new Logger({
      structuredLogging: true,
    });

    logger.error('Error occurred', { errorCode: 500 });`

These

Troubleshooting
---------------

(To be added based on common issues or setup problems encountered.)

Contributors
------------

- Tim Crooker <timothycrooker@gmail.com>

License
-------

This project is licensed under the MIT License.
