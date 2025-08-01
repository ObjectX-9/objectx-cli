import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import glob from 'fast-glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ProjectOptions {
  projectName: string;
  needDocs: boolean;
  styles: string[];
  projectType: string;
  packageManager: string;
}

interface TemplateData {
  projectName: string;
  needDocs: boolean;
  hasLess: boolean;
  hasTailwind: boolean;
  hasCssModules: boolean;
  year: number;
  packageManager: string;
  hasStorybook?: boolean;
  hasApiDoc?: boolean;
  hasTypesTest?: boolean;
}

/**
 * 生成项目文件
 */
export async function generateProject(targetDir: string, options: ProjectOptions): Promise<void> {
  // 使用绝对路径定位到templates目录
  const templateDir = path.resolve(
    __dirname, // src/utils
    '../../templates', // 回到项目根目录再进入src/templates
    options.projectType
  );

  console.log('模板目录路径:', templateDir);

  // 确保模板目录存在
  if (!fs.existsSync(templateDir)) {
    throw new Error(`找不到模板目录：${templateDir}`);
  }

  // 读取模板文件
  const templateFiles = await glob('**/*', {
    cwd: templateDir,
    dot: true,
    ignore: ['**/node_modules/**', '**/.git/**']
  });

  // 生成替换变量
  const templateData: TemplateData = {
    projectName: options.projectName,
    needDocs: options.needDocs,
    hasLess: options.styles.includes('less'),
    hasTailwind: options.styles.includes('tailwind'),
    hasCssModules: options.styles.includes('css-modules'),
    year: new Date().getFullYear(),
    packageManager: options.packageManager
  };

  // 根据项目类型的差异生成特定内容
  switch (options.projectType) {
    case 'component-lib':
      templateData.hasStorybook = options.needDocs;
      break;
    case 'tool-lib':
      // 工具包特有的配置
      templateData.hasApiDoc = true;
      break;
    case 'types-lib':
      // 类型包特有的配置
      templateData.hasTypesTest = true;
      break;
    default:
      break;
  }

  // 复制并渲染所有模板文件
  for (const file of templateFiles) {
    const sourcePath = path.join(templateDir, file);
    const targetPath = getTargetPath(file, targetDir, options);
    
    if (targetPath === '') continue; // 如果目标路径为空，则跳过
    
    if (fs.statSync(sourcePath).isDirectory()) {
      await fs.ensureDir(targetPath);
      continue;
    }

    // 读取文件内容
    const content = await fs.readFile(sourcePath, 'utf8');
    
    // 处理EJS模板
    if (file.endsWith('.ejs')) {
      const renderedContent = ejs.render(content, templateData);
      // 去掉.ejs后缀
      await fs.outputFile(
        targetPath.replace(/\.ejs$/, ''),
        renderedContent
      );
    } else {
      await fs.outputFile(targetPath, content);
    }
  }

  // 生成package.json
  await generatePackageJson(targetDir, options);
}

/**
 * 获取目标路径，处理特殊条件
 */
function getTargetPath(file: string, targetDir: string, options: ProjectOptions): string {
  let filename = file;
  
  // 处理点文件(如 .gitignore)
  if (filename.startsWith('_')) {
    filename = `.${filename.slice(1)}`;
  }
  
  // 根据条件排除某些文件
  if (filename.includes('storybook') && !options.needDocs) {
    return ''; // 如果不需要文档，则跳过storybook相关文件
  }
  
  // 如果选择了Storybook，则跳过demo目录
  if (filename.startsWith('demo') && options.needDocs) {
    return '';
  }
  
  // 处理样式文件
  if (filename.endsWith('.less') && !options.styles.includes('less')) {
    return '';
  }
  
  if (filename.includes('tailwind') && !options.styles.includes('tailwind')) {
    return '';
  }
  
  // Card组件只在选择了tailwind时生成
  if (filename.includes('components/Card') && !options.styles.includes('tailwind')) {
    return '';
  }
  
  // 移除.ejs后缀
  if (filename.endsWith('.ejs')) {
    filename = filename.replace(/\.ejs$/, '');
  }
  
  return path.join(targetDir, filename);
}

/**
 * 生成package.json
 */
async function generatePackageJson(targetDir: string, options: ProjectOptions): Promise<void> {
  const packageJson: any = {
    name: options.projectName,
    version: '0.1.0',
    private: false,
    scripts: {
      dev: 'vite',
      build: 'vite build && tsc --emitDeclarationOnly',
      lint: 'eslint src --ext .ts,.tsx',
      test: 'jest',
      // 使用postinstall替代prepare，添加条件检查以确保husky存在
      postinstall: 'node -e "try { require(\'husky\'); process.exit(0) } catch(e) { process.exit(1) }" && husky install || echo "Husky not installed"',
      setup: 'husky install' // 添加单独的setup脚本
    },
    files: [
      'dist'
    ],
    // 添加开发依赖
    devDependencies: {
      "husky": "^9.0.7",
      "typescript": "^5.2.2",
      "eslint": "^8.52.0",
      "terser": "^5.24.0" // 添加terser作为开发依赖
    }
  };
  
  // 根据项目类型添加不同的依赖和配置
  switch (options.projectType) {
    case 'component-lib':
      // 组件库项目使用ES模块
      packageJson.type = 'module';
      packageJson.main = './dist/index.js';
      packageJson.module = './dist/index.js';
      packageJson.types = './dist/index.d.ts';
      packageJson.exports = {
        '.': {
          import: './dist/index.js',
          require: './dist/index.cjs'
        }
      };
      
      packageJson.peerDependencies = {
        react: "^18.0.0",
        "react-dom": "^18.0.0"
      };
      
      // 组件库特有的开发依赖
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        "vite": "^5.0.0",
        "@vitejs/plugin-react": "^4.2.0",
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        // 无论是否选择了Tailwind，总是添加autoprefixer
        "autoprefixer": "^10.4.16",
        "postcss": "^8.4.31"
      };
      
      if (options.needDocs) {
        // 修改dev命令，如果有Storybook就优先使用Storybook
        packageJson.scripts.dev = 'storybook dev -p 6006';
        packageJson.scripts.preview = 'vite preview'; // 添加预览命令
        packageJson.scripts.storybook = 'storybook dev -p 6006';
        packageJson.scripts['build-storybook'] = 'storybook build';
        
        // 添加Storybook相关依赖
        packageJson.devDependencies = {
          ...packageJson.devDependencies,
          "@storybook/addon-essentials": "^7.5.3",
          "@storybook/addon-interactions": "^7.5.3",
          "@storybook/addon-links": "^7.5.3",
          "@storybook/addon-onboarding": "^1.0.8",
          "@storybook/blocks": "^7.5.3",
          "@storybook/react": "^7.5.3",
          "@storybook/react-vite": "^7.5.3",
          "storybook": "^7.5.3"
        };
      } else {
        // 没有Storybook则使用示例应用作为开发环境
        packageJson.scripts.dev = 'vite demo --open'; // 使用demo目录作为示例应用
        packageJson.scripts.preview = 'vite preview demo';
      }
      
      // 添加样式相关依赖
      if (options.styles.includes('less')) {
        packageJson.devDependencies = {
          ...packageJson.devDependencies,
          "less": "^4.2.0"
        };
      }
      
      if (options.styles.includes('tailwind')) {
        packageJson.devDependencies = {
          ...packageJson.devDependencies,
          "tailwindcss": "^3.3.5"
          // autoprefixer和postcss已经在前面添加了
        };
      }
      break;
    case 'tool-lib':
      // 工具包项目使用ES模块
      packageJson.type = 'module';
      packageJson.main = './dist/index.js';
      packageJson.module = './dist/index.js';
      packageJson.types = './dist/index.d.ts';
      packageJson.exports = {
        '.': {
          import: './dist/index.js',
          require: './dist/index.cjs'
        }
      };
      
      // 修改dev命令，使用watch模式运行vite，实现文件监听和自动重新打包
      packageJson.scripts.dev = 'vite build --mode watch';
      // 添加监听命令别名，与dev命令相同
      packageJson.scripts.watch = 'vite build --mode watch';
      packageJson.scripts.docs = 'typedoc --out docs src/index.ts';
      
      // 工具库特有的开发依赖
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        "vite": "^5.0.0",
        "typedoc": "^0.25.3"
      };
      break;
    case 'types-lib':
      // 修改build命令，直接使用tsc
      packageJson.scripts.build = 'tsc --emitDeclarationOnly';
      // 修改dev命令，使用tsc --watch进行类型定义监听
      packageJson.scripts.dev = 'tsc --emitDeclarationOnly --watch';
      // 添加监听命令别名
      packageJson.scripts.watch = 'tsc --emitDeclarationOnly --watch';
      // 保留build:types作为别名
      packageJson.scripts['build:types'] = 'tsc --emitDeclarationOnly';
      packageJson.scripts['test:types'] = 'tsc --noEmit';
      
      // 调整输出文件配置
      packageJson.main = './dist/index.d.ts';
      packageJson.types = './dist/index.d.ts';
      delete packageJson.module;
      delete packageJson.exports;
      
      // 类型包特有的开发依赖，不包括vite
      packageJson.devDependencies = {
        "husky": "^9.0.7",
        "typescript": "^5.2.2",
        "eslint": "^8.52.0",
        "tsd": "^0.30.0",
        "@types/node": "^20.8.10"
      };
      break;
  }
  
  await fs.writeFile(
    path.join(targetDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
} 