import chalk from 'chalk';

const RESERVED_KEYWORDS = ['node_modules', 'favicon.ico', '.git', '.idea', 'dist', 'build'];

/**
 * 验证项目名称是否合法
 */
export function validateProjectName(projectName: string): void {
  if (!projectName) {
    console.log(chalk.red('✖') + ' 项目名称不能为空');
    process.exit(1);
  }

  if (projectName.trim() !== projectName) {
    console.log(chalk.red('✖') + ' 项目名称不能以空格开头或结尾');
    process.exit(1);
  }

  // 检查是否是非法npm包名
  const npmNameValidation = validateNpmPackageName(projectName);
  if (!npmNameValidation.validForNewPackages) {
    console.log(chalk.red('✖') + ' 无效的项目名称: ' + projectName);
    
    if (npmNameValidation.errors) {
      npmNameValidation.errors.forEach(err => {
        console.log('  ' + chalk.red('✖') + ' ' + err);
      });
    }
    
    process.exit(1);
  }

  // 检查是否是保留关键字
  if (RESERVED_KEYWORDS.includes(projectName.toLowerCase())) {
    console.log(chalk.red('✖') + ` 项目名称不能使用保留关键字: ${projectName}`);
    process.exit(1);
  }
}

/**
 * 简单验证npm包名
 */
function validateNpmPackageName(name: string) {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (name.length > 214) {
    errors.push('名称不能超过214个字符');
  }

  if (name.match(/^[._]/)) {
    errors.push('名称不能以 . 或 _ 开头');
  }

  if (name.match(/[/\\]/)) {
    errors.push('名称不能包含斜杠');
  }

  if (name.trim() !== name) {
    errors.push('名称不能包含前导或尾随空格');
  }

  // 更多npm包名验证规则可以在此添加

  return {
    validForNewPackages: errors.length === 0,
    validForOldPackages: true,
    warnings,
    errors
  };
} 