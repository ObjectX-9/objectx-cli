import { Command } from 'commander';
import chalk from 'chalk';
import { createRequire } from 'module';
import { create } from './commands/create.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const cli = new Command();

cli
  .name('wegic-cli')
  .description('前端项目脚手架工具，支持组件库、工具包、类型包等项目模板')
  .version(pkg.version);

cli
  .command('create <project-name>')
  .description('创建一个新的项目')
  .option('-t, --template <template>', '指定项目模板 (component-lib/tool-lib/types-lib)')
  .action(create);

// 处理异常
cli.exitOverride();

try {
  cli.parse(process.argv);
} catch (err) {
  console.error(`\n${chalk.red('✖')} ${(err as Error).message}`);
  process.exit(1);
}

// 如果没有提供任何参数，显示帮助信息
if (!process.argv.slice(2).length) {
  cli.outputHelp();
} 