import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import * as inquirer from '@inquirer/prompts';
import ora from 'ora';
import { execa } from 'execa';
import { generateProject } from '../utils/generate.js';
import { validateProjectName } from '../utils/validate.js';

interface CreateOptions {
  template?: string;
}

// 为inquirer添加类型扩展
declare module '@inquirer/prompts' {
  interface Choice<T> {
    label?: string;
  }
  
  interface ConfirmOptions {
    default?: boolean;
  }
}

export async function create(projectName: string, options: CreateOptions): Promise<void> {
  console.log();
  console.log(`${chalk.bgBlue(' WEGIC CLI ')} 🚀 创建新项目...`);
  console.log();

  // 验证项目名称
  validateProjectName(projectName);

  // 获取目标目录
  const cwd = process.cwd();
  const targetDir = path.join(cwd, projectName);

  // 检查目录是否已存在
  if (fs.existsSync(targetDir)) {
    const overwriteResult = await inquirer.confirm({
      message: `目标目录 ${chalk.cyan(projectName)} 已存在。是否覆盖?`,
      default: false
    });
    
    if (!overwriteResult) {
      console.log(chalk.red('✖') + ' 操作取消');
      return;
    }
    
    const spinner = ora(`正在删除 ${chalk.cyan(targetDir)}...`).start();
    await fs.remove(targetDir);
    spinner.succeed(`已删除 ${chalk.cyan(targetDir)}`);
  }
  
  // 创建项目
  await fs.ensureDir(targetDir);
  
  // 选择项目类型
  const projectType = options.template || await inquirer.select({
    message: '请选择项目类型:',
    choices: [
      { value: 'component-lib', name: '组件库项目' },
      { value: 'tool-lib', name: '工具包项目' },
      { value: 'types-lib', name: '类型包项目' }
    ]
  });
  
  // 初始化项目选项
  const projectOptions: {
    projectName: string;
    needDocs: boolean;
    styles: string[];
    projectType: string;
    packageManager: string;
  } = {
    projectName,
    needDocs: false,
    styles: [],
    projectType,
    packageManager: 'pnpm'
  };
  
  // 只有组件库项目才询问这些问题
  if (projectType === 'component-lib') {
    // 选择是否需要文档展示
    projectOptions.needDocs = await inquirer.confirm({
      message: '是否需要文档展示 (Storybook)?',
      default: true
    });
    
    // 样式选择
    projectOptions.styles = await inquirer.checkbox({
      message: '选择样式解决方案 (可多选):',
      choices: [
        { value: 'less', name: 'Less', checked: true },
        { value: 'tailwind', name: 'Tailwind CSS' },
        { value: 'css-modules', name: 'CSS Modules', checked: true }
      ]
    });
  } else {
    // 非组件库项目设置默认值
    projectOptions.styles = ['css-modules']; // 默认使用CSS Modules
  }
  
  // 生成项目
  const spinner = ora('正在生成项目文件...').start();
  try {
    await generateProject(targetDir, projectOptions);
    spinner.succeed('项目文件生成完成');
  } catch (error) {
    spinner.fail('项目文件生成失败');
    console.error(error);
    return;
  }
  
  // 初始化Git仓库
  const gitSpinner = ora('初始化Git仓库...').start();
  try {
    await execa('git', ['init'], { cwd: targetDir });
    gitSpinner.succeed('Git仓库初始化完成');
  } catch (error) {
    gitSpinner.fail('Git仓库初始化失败');
  }
  
  console.log();
  console.log(`${chalk.green('✔')} 项目创建成功!`);
  console.log();
  console.log(`  cd ${chalk.cyan(projectName)}`);
  console.log(`  ${chalk.cyan('pnpm install')}`);
  console.log(`  ${chalk.cyan('pnpm dev')}`);
  console.log();
} 