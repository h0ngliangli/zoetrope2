<template>
<MarkdownPreview v-model="refMarkdown" />
</template>

<script setup>
const refMarkdown = ref(`
**AppImage** 是一种 **跨平台的 Linux 应用打包格式**，允许开发者将应用程序及其所有依赖项打包成单个可执行文件，无需安装即可运行。它的设计目标是提供一种简单、无依赖、便携的软件分发方式，类似于 Windows 的 \`.exe\` 或 macOS 的 \`.app\`。

---

## **AppImage 的核心特点**
### **1. 无需安装，即开即用**
   - 下载一个 \`.AppImage\` 文件，赋予可执行权限后直接运行，无需 \`root\` 权限或系统级安装。
   - **示例**：
     \`\`\`bash
     chmod +x MyApp.AppImage  # 赋予执行权限
     ./MyApp.AppImage         # 直接运行
     \`\`\`

### **2. 跨发行版兼容**
   - 理论上，一个 AppImage 可以在大多数 Linux 发行版（如 Ubuntu、Fedora、Arch Linux 等）上运行，无需针对不同系统重新打包。

### **3. 无系统污染**
   - AppImage 不会修改系统的库或配置文件，所有依赖都封装在镜像内，避免“依赖地狱”。
   - 卸载时直接删除 \`.AppImage\` 文件即可。

### **4. 便携性**
   - 可以存储在 USB 驱动器、云盘或任意目录，随带随用。

### **5. 沙盒支持（可选）**
   - 部分 AppImage 支持 **Firejail** 或 **AppImageLauncher**，实现沙盒隔离运行。

---

## **AppImage 的工作原理**
1. **自包含**：  
   - 应用程序及其依赖（库、配置文件、资源文件）被压缩到一个镜像文件中。
   - 使用 **FUSE（用户空间文件系统）** 在运行时动态挂载。

2. **运行时加载**：  
   - 执行时，AppImage 会挂载到一个临时目录（如 \`/tmp/.mount_XXXXX\`），然后启动其中的应用程序。

3. **清理**：  
   - 退出应用后，临时挂载点自动卸载，不留下痕迹（除非应用自身保存数据）。

---

## **如何使用 AppImage？**
### **1. 下载与运行**
   \`\`\`bash
   wget https://example.com/AppName.AppImage  # 下载
   chmod +x AppName.AppImage                  # 赋予可执行权限
   ./AppName.AppImage                         # 运行
   \`\`\`

### **2. 集成到系统（可选）**
   - 使用工具 **AppImageLauncher** 将 AppImage 集成到系统菜单，并自动更新：
     \`\`\`bash
     sudo apt install appimagelauncher  # Ubuntu/Debian
     \`\`\`
     安装后，双击 \`.AppImage\` 文件即可选择“集成到系统”。

### **3. 创建快捷方式**
   \`\`\`bash
   # 示例：创建桌面快捷方式（需手动编辑.desktop文件）
   echo "[Desktop Entry]
   Name=MyApp
   Exec=/path/to/AppName.AppImage
   Icon=/path/to/icon.png
   Type=Application" > ~/.local/share/applications/myapp.desktop
   \`\`\`

---

## **AppImage 的优缺点**
### **✅ 优点**
   - **简单**：用户无需处理依赖或安装。
   - **隔离性**：不干扰系统环境。
   - **便携**：适合放在外部存储设备中携带。

### **❌ 缺点**
   - **文件体积大**：每个 AppImage 都包含完整依赖，可能导致冗余。
   - **更新需手动**：用户需自行下载新版（除非应用内置更新功能）。
   - **非沙盒默认**：部分应用可能需要额外配置以增强安全性。

---

## **与其他打包格式对比**
| 特性               | AppImage       | Snap           | Flatpak        |
|--------------------|---------------|----------------|----------------|
| **是否需要安装**   | ❌ 直接运行     | ✅ 需安装       | ✅ 需安装       |
| **跨发行版支持**   | ✅ 是          | ✅ 是           | ✅ 是           |
| **依赖管理**       | ❌ 自包含       | ✅ 自动解决      | ✅ 自动解决      |
| **沙盒支持**       | ⚠️ 可选        | ✅ 默认         | ✅ 默认         |
| **典型应用**       | Krita, Joplin | Firefox, VS Code | LibreOffice, GIMP |

---

## **常见 AppImage 应用示例**
- [Krita](https://krita.org)（数字绘画）
- [Joplin](https://joplinapp.org)（笔记工具）
- [LibreOffice](https://www.libreoffice.org)（办公套件）
- [OBS Studio](https://obsproject.com)（直播录制）

---

## **总结**
AppImage 是 Linux 上一种 **用户友好** 的软件分发方式，适合希望 **免安装运行** 或 **避免依赖冲突** 的用户。如果你追求开箱即用的体验，可以优先选择 AppImage 格式的软件！ 🚀
`)
</script>